import ElementUI from 'element-ui';

export default function ({ $axios, redirect }) {    

	$axios.interceptors.response.use(response => {      
		if(response.data.success == false){        
			console.log("请求失败");        
			return;      
		}      
		// console.log(response);            
		if (response.data.state.code != 200) {
			let message = '';
			switch (response.data.state.code) {              
				case 400: message = '请求错误(400)'; break;              
				case 401: return history.push('/login'); break;              
				case 403: message = '拒绝访问(403)'; break;              
				case 404: message = '请求出错(404)'; break;              
				case 408: message = '请求超时(408)'; break;              
				case 500: message = 'Python代码报错(500)'; break;              
				case 501: message = '服务未实现(501)'; break;              
				case 502: message = '网络错误(502)'; break;              
				case 503: message = '服务不可用(503)'; break;              
				case 504: message = '网络超时(504)'; break;              
				case 505: message = 'HTTP版本不受支持(505)'; break;              
				default: message = `连接出错(${response.data.state.code})!`;          
			}
			console.log(message);
			ElementUI.MessageBox(message, '错误', {
				confirmButtonText: '',
				cancelButtonText: '',
				type: 'error'
			})
			return Promise.reject(message);
		}
		return Promise.resolve(response);
	// }, err => {      
	// 	if (err && err.response) {         
	// 		switch (err.response.status) {              
	// 			case 400: err.message = '请求错误(400)'; break;              
	// 			case 401: return history.push('/login'); break;              
	// 			case 403: err.message = '拒绝访问(403)'; break;              
	// 			case 404: err.message = '请求出错(404)'; break;              
	// 			case 408: err.message = '请求超时(408)'; break;              
	// 			case 500: err.message = 'Python代码报错(500)'; break;              
	// 			case 501: err.message = '服务未实现(501)'; break;              
	// 			case 502: err.message = '网络错误(502)'; break;              
	// 			case 503: err.message = '服务不可用(503)'; break;              
	// 			case 504: err.message = '网络超时(504)'; break;              
	// 			case 505: err.message = 'HTTP版本不受支持(505)'; break;              
	// 			default: err.message = `连接出错(${err.response.status})!`;          
	// 		}      
	// 	} else {          
	// 		err.message = '连接服务器失败!'      
  //   }
  //   this.$confirm(err.message, '错误', {
  //     confirmButtonText: '',
  //     cancelButtonText: '',
  //     type: 'error'
  //   })       
	// 	return Promise.reject(err);    
	})
}