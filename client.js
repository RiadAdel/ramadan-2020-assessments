const listOfVideoReqs = document.getElementById("listOfRequests");
const videoReqForm = document.getElementById("video-request-form");

function createVideoCard(videoReq, isPrepend = false) {
    const videoForm = `<div class="card mb-3">
                    <div class="card-body d-flex justify-content-between flex-row">
                    <div class="d-flex flex-column">
                        <h3>${videoReq.topic_title}</h3>
                        <p class="text-muted mb-2">${videoReq.topic_details}</p>
                        <p class="mb-0 text-muted">
                        ${

        videoReq.expected_result && `<strong>Expected results:</strong>${videoReq.expected_result}`
        }
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

function renderVideoRequests() {
    fetch("http://127.0.0.1:7777/video-request").
        then((res) => res.json()).
        then(data => {
            data.forEach(videoReq => {
                createVideoCard(videoReq);
            });
        })
}

function sendVideoRequest() {

    const data = new FormData(videoReqForm);
    fetch("http://127.0.0.1:7777/video-request", {
        method: 'POST',
        body: data,
    }).then(res => res.json())
        .then(data => {
            createVideoCard(data, isPrepend = true)
        })
        .catch(e => console.log(e))

}

document.addEventListener('DOMContentLoaded', () => {
    renderVideoRequests();
    
    videoReqForm.addEventListener("submit", function (e) {
        e.preventDefault();
        sendVideoRequest();
    })
})
