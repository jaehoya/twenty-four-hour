import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_ENDPOINT || 'http://localhost:4000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// 백엔드 연결 실패 시 임시 모킹 데이터 (프론트엔드만 실행 시 사용)
const MOCK_MODE = true; // 백엔드 연결 안 될 때 true로 설정

// 임시 모킹 데이터 (모듈 레벨에서 유지)
let mockFiles = [
    { id: 1, name: 'sample1.pdf', original_name: 'sample1.pdf', size: 1024, mime_type: 'file', mimeType: 'application/pdf', createdAt: new Date().toISOString() },
    { id: 2, name: 'sample2.jpg', original_name: 'sample2.jpg', size: 2048, mime_type: 'file', mimeType: 'image/jpeg', createdAt: new Date().toISOString() },
    { id: 3, name: 'sample3.docx', original_name: 'sample3.docx', size: 4096, mime_type: 'file', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', createdAt: new Date().toISOString() },
];

// 요청 인터셉터: FormData에서 파일 정보 추출 및 MOCK_MODE 모킹
api.interceptors.request.use(
    (config) => {
        // FormData인 경우 파일 정보를 config에 저장
        if (config.data instanceof FormData) {
            const file = config.data.get('file');
            if (file instanceof File) {
                config._mockFileInfo = {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                };
            }
        }
        
        // MOCK_MODE일 때 특정 요청에 대해 모킹 응답 반환
        if (MOCK_MODE) {
            // POST /files/upload 요청
            if (config.method === 'post' && config.url?.includes('/files/upload')) {
                const fileInfo = config._mockFileInfo || {};
                const fileId = Date.now() + Math.random(); // 고유 ID 생성
                const fileName = fileInfo.name || 'uploaded_file';
                
                // 모킹 파일 목록에 추가
                const newFile = {
                    id: fileId,
                    name: fileName,
                    original_name: fileName,
                    size: fileInfo.size || 0,
                    mime_type: fileInfo.type || 'file',
                    mimeType: fileInfo.type || 'file',
                    createdAt: new Date().toISOString(),
                };
                mockFiles.push(newFile);
                
                // 모킹 응답을 config에 저장하고 특별한 에러로 표시
                const mockError = new Error('MOCK_RESPONSE');
                mockError.isMockResponse = true;
                mockError.config = config;
                mockError.response = {
                    data: { 
                        state: 201,
                        message: '파일 업로드 성공 (모킹)',
                        file: {
                            id: fileId,
                            name: fileName,
                            original_name: fileName,
                            stored_name: fileName,
                            size: fileInfo.size || 0,
                            mime_type: fileInfo.type || 'file',
                            path: '/mock/path/' + fileName,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        }
                    },
                    status: 201,
                    statusText: 'Created',
                    headers: {},
                    config,
                };
                return Promise.reject(mockError);
            }
            
            // GET /files 요청도 모킹 응답 반환
            if (config.method === 'get' && config.url?.includes('/files') && !config.url?.includes('/download')) {
                // localStorage에서 저장된 파일도 가져오기
                const storedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
                
                // mockFiles와 localStorage 파일을 합치기 (중복 제거)
                const allFilesMap = new Map();
                
                // mockFiles 추가
                mockFiles.forEach(file => {
                    allFilesMap.set(file.id, file);
                });
                
                // localStorage 파일 추가 (progress 속성 제거)
                storedFiles.forEach(file => {
                    const { progress, ...fileWithoutProgress } = file;
                    allFilesMap.set(file.id, fileWithoutProgress);
                });
                
                const allFiles = Array.from(allFilesMap.values());
                
                const mockError = new Error('MOCK_RESPONSE');
                mockError.isMockResponse = true;
                mockError.config = config;
                mockError.response = {
                    data: { files: allFiles },
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config,
                };
                return Promise.reject(mockError);
            }
            
            // GET /disk/usage 요청 모킹
            if (config.method === 'get' && config.url?.includes('/disk/usage')) {
                const mockError = new Error('MOCK_RESPONSE');
                mockError.isMockResponse = true;
                mockError.config = config;
                mockError.response = {
                    data: { 
                        data: {
                            used: 1024 * 1024 * 1024 * 0.5, // 0.5GB
                            total: 2 * 1024 * 1024 * 1024, // 2GB
                        }
                    },
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config,
                };
                return Promise.reject(mockError);
            }
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터: 네트워크 에러 시 모킹 데이터 반환
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        // 모킹 응답인 경우
        if (error.isMockResponse && error.response) {
            return Promise.resolve(error.response);
        }
        
        // 네트워크 에러 또는 연결 실패 시
        if (MOCK_MODE && (!error.response || error.code === 'ECONNREFUSED' || error.message.includes('Network Error'))) {
            const config = error.config;
            
            // GET /files 요청
            if (config.method === 'get' && config.url?.includes('/files') && !config.url?.includes('/download')) {
                // localStorage에서 저장된 파일도 가져오기
                const storedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
                
                // mockFiles와 localStorage 파일을 합치기 (중복 제거)
                const allFilesMap = new Map();
                
                // mockFiles 추가
                mockFiles.forEach(file => {
                    allFilesMap.set(file.id, file);
                });
                
                // localStorage 파일 추가 (progress 속성 제거)
                storedFiles.forEach(file => {
                    const { progress, ...fileWithoutProgress } = file;
                    allFilesMap.set(file.id, fileWithoutProgress);
                });
                
                const allFiles = Array.from(allFilesMap.values());
                
                return Promise.resolve({
                    data: { files: allFiles },
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config,
                });
            }
            
            // GET /disk/usage 요청
            if (config.method === 'get' && config.url?.includes('/disk/usage')) {
                return Promise.resolve({
                    data: { 
                        data: {
                            used: 1024 * 1024 * 1024 * 0.5, // 0.5GB
                            total: 2 * 1024 * 1024 * 1024, // 2GB
                        }
                    },
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config,
                });
            }
            
            // GET /favorites 요청
            if (config.method === 'get' && config.url?.includes('/favorites')) {
                return Promise.resolve({
                    data: { favorites: [] },
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config,
                });
            }
            
            // POST /users/login 요청
            if (config.method === 'post' && config.url?.includes('/users/login')) {
                return Promise.resolve({
                    data: { accessToken: 'mock_token_' + Date.now() },
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config,
                });
            }
            
            // POST /users/signup 요청
            if (config.method === 'post' && config.url?.includes('/users/signup')) {
                return Promise.resolve({
                    data: { message: '회원가입 성공 (모킹)' },
                    status: 201,
                    statusText: 'Created',
                    headers: {},
                    config,
                });
            }
            
            // DELETE /files/:id 요청
            if (config.method === 'delete' && config.url?.includes('/files/')) {
                // 파일 ID 추출
                const fileIdMatch = config.url.match(/\/files\/(\d+)/);
                if (fileIdMatch) {
                    const fileId = parseFloat(fileIdMatch[1]);
                    const index = mockFiles.findIndex(f => f.id === fileId);
                    if (index !== -1) {
                        mockFiles.splice(index, 1);
                    }
                }
                
                return Promise.resolve({
                    data: { code: 'FILE_DELETED', message: '파일 삭제 성공 (모킹)' },
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config,
                });
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;