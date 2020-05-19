
let sortState = 'newFirst'

function debounce(fun, delay) {
    let timeout;

    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fun.apply(this, args), delay);
    };

}

function isFormValid(form) {
    const name = form.get("author_name");
    const email = form.get("author_email");
    const title = form.get("topic_title");
    const details = form.get("topic_details");

    if (!name.trim()) {
        document.getElementById("author_name_feedback").innerText = "This field is required";
        document.querySelector("[name=author_name]").classList.add("is-invalid");
    }

    const emailformat = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/
    if (!email) {
        document.getElementById("author_email_feedback").innerText = "This field is required";
        document.querySelector("[name=author_email]").classList.add("is-invalid");
    } else if (!emailformat.test(email)) {
        document.getElementById("author_email_feedback").innerText = "Please enter valid email";
        document.querySelector("[name=author_email]").classList.add("is-invalid");
    }

    if (!title) {
        document.getElementById("topic_title_feedback").innerText = "This field is required";
        document.querySelector("[name=topic_title]").classList.add("is-invalid");
    } else if (title.length > 30) {
        document.getElementById("topic_title_feedback").innerText = "Length most be less than 30 character";
        document.querySelector("[name=topic_title]").classList.add("is-invalid");
    }

    if (!details) {
        document.getElementById("topic_details_feedback").innerText = "This field is required";
        document.querySelector("[name=topic_details]").classList.add("is-invalid")
    }

    const dataElms = document.getElementById('video-request-form').querySelectorAll('.is-invalid');
    if (dataElms.length) {
        dataElms.forEach(elm => {
            elm.addEventListener('input', function () {
                elm.classList.remove('is-invalid')
            })
        })
        return false;
    }
    return true;
}

function createVideoCard(videoReq, listOfVideoReqs, isPrepend = false) {
    const videoForm = `<div class="card mb-3">
                    <div class="card-body d-flex justify-content-between flex-row">
                    <div class="d-flex flex-column">
                        <h3>${videoReq.topic_title}</h3>
                        <p class="text-muted mb-2">${videoReq.topic_details}</p>
                        <p class="mb-0 text-muted">
                        ${videoReq.expected_result && `<strong>Expected results:</strong>${videoReq.expected_result}`}
                        </p>
                    </div>
                    <div class="d-flex flex-column text-center">
                        <a id = ${`vote_up_` + videoReq._id} class="btn btn-link">🔺</a>
                        <h3 id = ${`vote_score_` + videoReq._id}>${videoReq.votes.ups - videoReq.votes.downs}</h3>
                        <a id = ${`vote_down_` + videoReq._id} class="btn btn-link">🔻</a>
                    </div>
                    </div>
                    <div class="card-footer d-flex flex-row justify-content-between">
                    <div>
                        <span class="text-info">${videoReq.status.toUpperCase()}</span>
                        &bullet; added by <strong>${videoReq.author_name}</strong> on
                        <strong>${new Date(videoReq.submit_date).toDateString()}</strong>
                    </div>
                    <div class="d-flex justify-content-center flex-column 408ml-auto mr-2">
                        <div class="badge badge-success">
                        ${videoReq.target_level}
                        </div>
                    </div>
                    </div>
                </div>
                `
    let div = document.createElement('div');
    div.innerHTML = videoForm;

    if (isPrepend)
        listOfVideoReqs.prepend(div);
    else
        listOfVideoReqs.appendChild(div);

    const voteUp = document.getElementById('vote_up_' + videoReq._id);
    const voteDown = document.getElementById('vote_down_' + videoReq._id);
    const voteScore = document.getElementById('vote_score_' + videoReq._id);

    voteUp.addEventListener('click', () => {
        fetch("http://127.0.0.1:7777/video-request/vote", {
            method: 'PUT',
            headers: {
                'content-Type': 'application/json',
            },
            body: JSON.stringify({ id: videoReq._id, vote_type: 'ups' })
        }).then(res => res.json()).
            then(data => voteScore.innerText = data.votes.ups - data.votes.downs)
    });
    voteDown.addEventListener('click', () => {
        fetch("http://127.0.0.1:7777/video-request/vote", {
            method: 'PUT',
            headers: {
                'content-Type': 'application/json',
            },
            body: JSON.stringify({ id: videoReq._id, vote_type: 'downs' })
        }).then(res => res.json()).
            then(data => voteScore.innerText = data.votes.ups - data.votes.downs)
    });
}

function renderVideoRequests(listOfVideoReqs, sortBy = "newFirst", search = "") {
    fetch(`http://127.0.0.1:7777/video-request?sortBy=${sortBy}&search=${search}`).
        then((res) => res.json()).
        then(data => {
            listOfVideoReqs.innerHTML = "";
            data.forEach(videoReq => {
                createVideoCard(videoReq, listOfVideoReqs);
            });
        });
}

function sendVideoRequest(videoReqForm, listOfVideoReqs) {
    const data = new FormData(videoReqForm);
    if (!isFormValid(data))
        return
    fetch("http://127.0.0.1:7777/video-request", {
        method: 'POST',
        body: data,
    }).then(res => res.json())
        .then(data => {
            createVideoCard(data, listOfVideoReqs, isPrepend = true)
        })
        .catch(e => console.log(e))
}

function changeActiveState(element) {
    sortState = element.firstElementChild.value;
    element.classList.add('active');
    if (element.firstElementChild.value == "newFirst") {
        document.getElementById("sort-by-top-voted").classList.remove('active')
    }
    else {
        document.getElementById("sort-by-new-first").classList.remove('active')
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const listOfVideoReqsElm = document.getElementById("listOfRequests");
    const videoReqFormElm = document.getElementById("video-request-form");
    const sortByElms = document.querySelectorAll("[id*=sort-by-]");
    const searchBoxElm = document.getElementById("video-requests-search-box");
    searchBoxElm.addEventListener("input", debounce(
        function (e) {
            renderVideoRequests(listOfVideoReqsElm, sortState, e.target.value);
        },
        400
    ))
    renderVideoRequests(listOfVideoReqsElm);

    sortByElms.forEach((element) => {
        element.addEventListener('click', function (e) {
            e.preventDefault();
            renderVideoRequests(listOfVideoReqsElm, element.firstElementChild.value);
            changeActiveState(element);
        })
    })

    videoReqFormElm.addEventListener("submit", function (e) {
        e.preventDefault();
        sendVideoRequest(videoReqFormElm, listOfVideoReqsElm);
    })
});