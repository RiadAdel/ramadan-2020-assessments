function createVideoCard(videoReq) {
    const videoForm = `<div class="card mb-3">
                    <div class="card-body d-flex justify-content-between flex-row">
                    <div class="d-flex flex-column">
                        <h3>${videoReq.topic_title}</h3>
                        <p class="text-muted mb-2">${videoReq.topic_details}</p>
                        <p class="mb-0 text-muted">
                        ${

                            videoReq.expected_result &&`<strong>Expected results:</strong>${videoReq.expected_result}`
                        }
                        </p>
                    </div>
                    <div class="d-flex flex-column text-center">
                        <a class="btn btn-link">🔺</a>
                        <h3>${videoReq.votes.ups - videoReq.votes.downs}</h3>
                        <a class="btn btn-link">🔻</a>
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
    return div;
}
document.addEventListener('DOMContentLoaded', () => {
    const listOfVideoReqs = document.getElementById("listOfRequests")
    fetch("http://127.0.0.1:7777/video-request").
        then((res) => res.json()).
        then(data => {
            data.forEach(videoReq => {
                listOfVideoReqs.appendChild(createVideoCard(videoReq));
            });
        })

    const videoReqForm = document.getElementById("video-request-form");
    console.log(videoReqForm)
    videoReqForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const data = new FormData(videoReqForm);
        fetch("http://127.0.0.1:7777/video-request", {
            method: 'POST',
            body: data,
        }).then(res => res.json())
            .then(data => {
                listOfVideoReqs.prepend(createVideoCard(data))
            })
            .catch(e => console.log(e))
    })
})

