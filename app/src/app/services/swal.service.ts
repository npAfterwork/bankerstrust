/**
 * Created by Leto on 03.03.2017.
 */
import sweetalert from 'sweetalert2';
import {SweetAlertOptions} from 'sweetalert2';
// import 'sweetalert2/dist/sweetalert2.min.css'; ASKME: why does it not work if imported here? require vs import ??

class SweetAlertService {

	static $inject = [];

	constructor() {
	}

	public swal(options: SweetAlertOptions): Promise<any> {
		return sweetalert(options);
	}

	public prompt(options: SweetAlertOptions): Promise<any> {
		const baseOptions = {
			showCancelButton: true,
			confirmButtonText: 'Submit',
			input: 'text'
		};
		return sweetalert(Object.assign(baseOptions, options));
	}

	public confirm(options: SweetAlertOptions): Promise<any> {
		const baseOptions = {
			showCancelButton: true,
			confirmButtonText: 'Confirm',
			type: 'warning'
		};
		return sweetalert(Object.assign(baseOptions, options));
	}

	public alert(options: SweetAlertOptions): Promise<any> {
		const baseOptions = {
			confirmButtonText: 'OK',
			type: 'info'
		};
		return sweetalert(Object.assign(baseOptions, options));
	}

	public question(options: SweetAlertOptions): Promise<any> {
		return this.alert(Object.assign({type: 'question'}, options));
	}

	public success(options: SweetAlertOptions): Promise<any> {
		return this.alert(Object.assign({type: 'success'}, options));
	}

	public error(options: SweetAlertOptions): Promise<any> {
		return this.alert(Object.assign({type: 'error'}, options));
	}

	public warn(options: SweetAlertOptions): Promise<any> {
		return this.alert(Object.assign({type: 'warning'}, options));
	}

	public info(options: SweetAlertOptions): Promise<any> {
		return this.alert(Object.assign({type: 'info'}, options));
	}
}

export {SweetAlertService}
