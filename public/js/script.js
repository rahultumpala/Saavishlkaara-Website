import axios from "axios";

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", async () => {
        const url = "https:://saavishkaara.com/api/v1/mail/contact-form-mail";
        const email = document.getElementById('email')
        const message = document.getElementById('message')
        const name = document.getElementById('name')
        const subject = document.getElementById('subject')
        const body = { email, message, name, subject }
        await axios.post(url, body).then((response) => {
            if (response.status == 200) {
                response.data.status == "success" ? alert("mail sent successfully") : alert("mail could not be sent")
            }
        });
    })
}