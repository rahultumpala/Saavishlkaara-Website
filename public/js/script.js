import axios from "axios";

export const hideAlert = () => {
    const el = document.querySelector('.myAlert');
    if (el) el.parentElement.removeChild(el);
};
// type is 'error' or 'info'
export const showAlert = (type, msg) => {
    hideAlert();
    const markup = `<div class="myAlert myAlert--${type}">${msg}</div>`;
    document.querySelector('#contactForm').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, 5000);
};
const contactForm = document.getElementById("contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        // const url = "https://saavishkaara.com/api/v1/mail/contact-form-mail";
        const url = "http://localhost:5050/api/v1/mail/contact-form-mail";
        const email = document.getElementById('email')
        const message = document.getElementById('message')
        const name = document.getElementById('name')
        const subject = document.getElementById('subject')
        const data = { email: email.value, message: message.value, name: name.value, subject: subject.value }
        try {
            const response = await axios({
                method: "POST",
                url,
                data,
                withCredentials: true,
            });
            if (response.data.status == "success") {
                showAlert("info", "Message sent successfully")
                email.value = "";
                message.value = "";
                name.value = "";
                subject.value = "";
                setTimeout(hideAlert, 3000)
            }
        } catch (error) {
            showAlert("error", error)
            setTimeout(hideAlert, 3000)
        }

    })
}