//admin login data send to while login helper
class loginResponse {
    constructor(admin_data) {
        this.admin_data = admin_data;
    }
    get data() {
        let send_data = {};
        send_data.id = this.admin_data.id;
        send_data.firstName = this.admin_data.firstName;
        send_data.lastName = this.admin_data.lastName;
        send_data.email = this.admin_data.email;
        send_data.token = this.admin_data.token;
        send_data.created_at = this.admin_data.created_at;
        return send_data;
    }
}
module.exports = loginResponse;