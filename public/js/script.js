import axios from "axios";

export const hideAlert = () => {
    const el = document.querySelector('.myAlert');
    if (el) el.parentElement.removeChild(el);
};
// type is 'error' or 'info'
export const showAlert = (type, msg, id) => {
    hideAlert();
    const markup = `<div class="myAlert myAlert--${type}">${msg}</div>`;
    document.querySelector(id).insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, 5000);
};

const globalUrl = "http://localhost:5050";
// const globalUrl = "https://saavishkaara.com"

const contactForm = document.getElementById("contactForm");
const signinForm = document.getElementById("signin-form");
const newBlogBtn = document.getElementById("new-blog")
const viewBlogsBtn = document.getElementById("view-blogs")
const blogEditor = document.getElementById("editor")
const saveArticleBtn = document.getElementById("saveArticleBtn")
const publishArticleBtn = document.getElementById("publishArticleBtn")

if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const alertLocation = "#contactForm"
        const url = globalUrl + "/api/v1/mail/contact-form-mail";
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
                showAlert("info", "Message sent successfully", alertLocation)
                email.value = "";
                message.value = "";
                name.value = "";
                subject.value = "";
                setTimeout(hideAlert, 3000)
            }
        } catch (error) {
            showAlert("error", error, alertLocation)
            setTimeout(hideAlert, 3000)
        }

    })
}

if (signinForm) {
    signinForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const alertLocation = "#signin-form";
        const url = globalUrl + "/api/v1/users/login";
        const newUrl = "/user-profile"
        const phoneNumber = document.getElementById('inputMobileNumber')
        const password = document.getElementById('inputPassword')
        const data = { phoneNumber: phoneNumber.value, password: password.value }
        try {
            const response = await axios({
                method: "POST",
                url,
                data,
                withCredentials: true,
            });
            if (response.data.status == "success") {
                showAlert("info", "Login Successful", alertLocation)
                phoneNumber.value = "";
                password.value = "";
                setTimeout(hideAlert, 3000)
                window.location.assign(newUrl);
            }
        } catch (error) {
            showAlert("error", error.response.data.message, alertLocation)
            setTimeout(hideAlert, 3000)
        }
    })
}

if (newBlogBtn) {
    newBlogBtn.addEventListener("click", async (e) => {
        window.location.assign("/new-blog-post")
    })
}
if (viewBlogsBtn) {
    viewBlogsBtn.addEventListener("click", async (e) => {
        window.location.assign("/my-blogs")
    })
}

if (blogEditor) {
    const editor = new EditorJS({
        holder: 'editor',
        tools: {
            image: SimpleImage,
            header: {
                class: Header,
                inlineToolbar: ['link']
            },
            list: {
                class: List,
                inlineToolbar: true
            }
        },
        data: {
            "time": 1550476186479,
            "blocks": [
                {
                    "type": "header",
                    "data": {
                        "text": "Header Text",
                        "level": 2
                    }
                },
                {
                    "type": "paragraph",
                    "data": {
                        "text": "Hey. Meet the new Editor. On this page you can see it in action — try to edit this text. The first header will be the title of the blog post"
                    }
                },
            ],
            "version": "2.8.1"
        }
    })

    const alertLocation = "#editorContainer"
    saveArticleBtn.addEventListener('click', async (e) => {
        try {
            const url = globalUrl + "/api/v1/blog/save"
            const data = await editor.save();
            // console.log(data);
            const response = await axios({
                method: "POST",
                url,
                data,
                withCredentials: true,
            });
            if (response.data.status == "success") {
                showAlert("info", "Save Succesful", alertLocation)
                setTimeout(hideAlert, 3000)
                // window.location.assign(newUrl);
            }
        } catch (error) {
            console.log(error);
            showAlert("error", "Error while Saving Article", alertLocation)
            setTimeout(hideAlert, 3000)
        }
    })

    publishArticleBtn.addEventListener('click', async (e) => {
        try {
            const url = globalUrl + "/api/v1/blog/publish"
            const data = await editor.save();
            // console.log(data);
            const response = await axios({
                method: "POST",
                url,
                data,
                withCredentials: true,
            });
            if (response.data.status == "success") {
                showAlert("info", "Publish Succesful", alertLocation)
                setTimeout(hideAlert, 3000)
                // window.location.assign(newUrl);
            }
        } catch (error) {
            console.log(error);
            showAlert("error", "Error while Saving Article", alertLocation)
            setTimeout(hideAlert, 3000)
        }
    })
}