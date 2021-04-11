import axios from "axios";
axios.defaults.withCredentials = true;
import { qualFragment } from "./dropdown-options";

const bearerToken = localStorage.getItem("token");
axios.defaults.headers.common["Authorization"] = "Bearer " + bearerToken;

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

self.addEventListener

const globalUrl = "http://localhost:5050";
// const globalUrl = "https://saavishkaara.com"

const contactForm = document.getElementById("contactForm");
const signinForm = document.getElementById("signin-form");
const newBlogBtn = document.getElementById("new-blog")
const viewBlogsBtn = document.getElementById("view-blogs")
const blogEditor = document.getElementById("editor")
const saveArticleBtn = document.getElementById("saveArticleBtn")
const publishArticleBtn = document.getElementById("publishArticleBtn")
const logoutBtn = document.getElementById("logout-btn")
const signupForm = document.getElementById("signup-form")
const createCourseForm = document.getElementById("createCourseForm")
const createCourseBtn = document.getElementById("create-course-btn-in-profile-page")

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
            });
            if (response.data.status == "success") {
                localStorage.setItem("token", response.data.token);
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
            "blocks": editBlog == true ? blogContent : [
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
            const hasModified = saveArticleBtn.dataset.modify || false;
            const blogId = hasModified ? saveArticleBtn.dataset.id : undefined;
            const body = { data, hasModified, blogId }
            // console.log(data);
            const response = await axios({
                method: "POST",
                url,
                data: body,
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
            const hasModified = publishArticleBtn.dataset.modify || false;
            const url = globalUrl + "/api/v1/blog/publish"

            const data = await editor.save();
            const blogId = hasModified ? saveArticleBtn.dataset.id : undefined;
            const body = { data, hasModified, blogId }
            // console.log(data);
            const response = await axios({
                method: "POST",
                url,
                data: body,
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

if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
        const url = globalUrl + "/api/v1/users/logout"
        const alertLocation = ".emp-profile"
        const newUrl = "/"
        try {
            const response = await axios({
                method: "POST",
                url,
                withCredentials: true,
            });
            if (response.data.status == "success") {
                window.location.assign(newUrl);
                showAlert("info", "Logout Successful", alertLocation)
                // setTimeout(hideAlert, 3000)
            }
        } catch (error) {
            showAlert("error", error.response.data.message, alertLocation)
            setTimeout(hideAlert, 3000)
        }
    })
}

if (signupForm) {
    document.getElementById("qualification").appendChild(qualFragment);
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const email = document.getElementById("email").value;
        const phoneNumber = document.getElementById("inputMobileNumber").value;
        const collegeName = document.getElementById("collegeName").value;
        const branchName = document.getElementById("branchName").value;
        const qualification = document.getElementById("qualification").value;
        const password = document.getElementById("inputPassword").value;
        const passwordConfirm = document.getElementById("inputPasswordConfirm").value;
        const userDescription = document.getElementById("userDesc").value;
        const alertLocation = "#signup-form";
        const url = globalUrl + "/api/v1/users/signup";
        const newUrl = "/user-profile"
        const username = `${firstName} ${lastName}`;
        const data = { firstName, email, lastName, username, password, passwordConfirm, phoneNumber, collegeName, branchName, qualification, userDescription }
        try {
            const response = await axios({
                method: "POST",
                url,
                data,
                withCredentials: true,
            });
            if (response.data.status == "success") {
                showAlert("info", "Registration Successful", alertLocation)
                setTimeout(hideAlert, 3000)
                window.location.assign(newUrl);
            }
        } catch (error) {
            showAlert("error", error.response.data.message, alertLocation)
            setTimeout(hideAlert, 3000)
        }
    })
}

if (createCourseBtn) {
    createCourseBtn.addEventListener("click", function (e) {
        window.location.assign("/create-course")
    })
}

if (createCourseForm) {
    createCourseForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const alertLocation = "#footer";
        const url = globalUrl + "/api/v1/courses";
        const courseName = document.getElementById('courseName')
        const tutor = document.getElementById('tutor')
        const duration = document.getElementById('duration')
        const startDate = document.getElementById('startDate')
        const endDate = document.getElementById('endDate')
        const description = document.getElementById('description')
        const learningObjectives = document.getElementById('learningObjectives')
        const prerequisites = document.getElementById('prerequisites')
        const certificateOnCompletion = document.getElementById('certificateOnCompletion')
        const resources = document.getElementById('resources')
        const tags = document.getElementById('tags')
        const price = document.getElementById('price')
        const isPublic = document.getElementById('isPublic')
        const upiId = document.getElementById('upiId')
        const regnLink = document.getElementById('regnLink')
        const data = {
            name: courseName.value, tutor: tutor.value, duration: duration.value,
            startDate: startDate.value, endDate: endDate.value, description: description.value, learningObjectives: learningObjectives.value,
            prerequisites: prerequisites.value, certificateOnCompletion: certificateOnCompletion.checked,
            resources: resources.value, tags: tags.value, price: price.value, isPublic: isPublic.checked,
            upiId: upiId.value, regnLink: regnLink.value
        }
        // console.log(data);
        try {
            const response = await axios({
                method: "POST",
                url,
                data,
                withCredentials: true,
            });
            if (response.data.status == "success") {
                showAlert("info", "Course created successfully", alertLocation)
                setTimeout(hideAlert, 3000)
            } else {
                showAlert("error", "Something went wrong", alertLocation)
                setTimeout(hideAlert, 3000)
            }
        } catch (error) {
            showAlert("error", error.response.data.message, alertLocation)
            setTimeout(hideAlert, 3000)
        }
    });
}
