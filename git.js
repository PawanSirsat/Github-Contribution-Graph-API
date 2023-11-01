let githubToken = {{process.env.TOKEN_API}}
let githubUsername = 'PawanSirsat'
let squares = document.querySelector('.squares')
const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

document.addEventListener('DOMContentLoaded', function () {
  const fetchButton = document.getElementById('fetch-button')
  const usernameInput = document.getElementById('username')
  const userInfoDiv = document.getElementById('user-info')

  function getUserData(username) {
    if (username) {
      fetch(`https://api.github.com/users/${username}`)
        .then((response) => response.json())
        .then((data) => {
          datesegments = data.created_at.split('T').shift().split('-')

          userInfoDiv.innerHTML = ` <div class="profile-header">
                            <img id="avatar" src="${data.avatar_url}" alt="">
                            <div class="profile-info-wrapper">
                                <div class="profile-name">
                                    <h2 id="name">${data.name}</h2>
                                    <a href="${
                                      data.html_url
                                    }" target="_blank" rel="noopener noreferrer" id="user">@${
            data.login
          }</a>
                                </div>
                                <p id="date">Joined ${datesegments[2]} ${
            months[datesegments[1] - 1]
          } ${datesegments[0]}</p>
                            </div>
                        </div>
<p id="bio">${data.bio}</p>
            <div class="profile-stats-wrapper">
                            <div class="profile-stat">
                                <p class="stat-title">Repos</p>
                                <p id="repos" class="stat-value">${
                                  data.public_repos
                                }</p>
                            </div>
                            <div class="profile-stat">
                                <p class="stat-title">Followers</p>
                                <p id="followers" class="stat-value">${
                                  data.followers
                                }</p>
                            </div>
                            <div class="profile-stat">
                                <p class="stat-title">Following</p>
                                <p id="following" class="stat-value">${
                                  data.following
                                }</p>
                            </div>
                        </div>
            <div class="profile-bottom-wrapper">
                            <div class="profile-info">
                                <div class="bottom-icons" style="opacity: 0.5;"><img width="20" height="20" src="https://img.icons8.com/ios-filled/50/FFFFFF/marker.png" alt="marker"/></div>
                                <p id="location" style="opacity: 0.5;">Pune</p>
                            </div>
                            <div class="profile-info">
                                <div class="bottom-icons" style="opacity: 0.5;"><img width="20" height="20" src="https://img.icons8.com/ios-filled/50/FFFFFF/link--v1.png" alt="link--v1"/></div>
                                <a href="https://pawansirsat.github.io/Portfolio-Website/" id="page" style="opacity: 0.5;">https://pawansirsat.github.io/Portfolio-Website/</a>
                            </div>
                            <div class="profile-info">
                                <div class="bottom-icons"><img width="20" height="20" src="https://img.icons8.com/ios-filled/50/FFFFFF/twitter.png" alt="twitter"/></div>
                                <a href="https://twitter.com/sirsat_pawan" id="twitter">sirsat_pawan</a>
                            </div>
                            <div class="profile-info">
                                <div class="bottom-icons" style="opacity: 0.5;"><img width="20" height="20" src="https://img.icons8.com/pastel-glyph/64/FFFFFF/company--v1.png" alt="company--v1"/></div>
                                <p id="company" style="opacity: 0.5;">Not Available</p>
                            </div>
                        </div>
          `
        })
        .catch((error) => {
          userInfoDiv.innerHTML = `<p>Error: User not found</p>`
        })
    }
  }

  fetchButton.addEventListener('click', function () {
    const username = usernameInput.value
    squares.innerHTML = ''
    githubUsername = username
    getGitHubContributions()
    getUserData(username)
  })

  // Automatically load data for a default GitHub user when the page loads
  const defaultUsername = 'PawanSirsat'
  getUserData(defaultUsername)
})

let query = `
        query($userName: String!) {
            user(login: $userName) {
                contributionsCollection {
                    contributionCalendar {
                        totalContributions
                        weeks {
                            contributionDays {
                                contributionCount
                                date
                            }
                        }
                    }
                }
            }
        }
        `

async function getGitHubContributions() {
  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { userName: githubUsername },
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch GitHub data')
    }

    const data = await response.json()
    const contributions =
      data.data.user.contributionsCollection.contributionCalendar.weeks.flatMap(
        (week) => week.contributionDays
      )

    contributions.forEach((contribution) => {
      const date = new Date(contribution.date)
      const day = date.getDate()
      const contributionCount = contribution.contributionCount
      const square = document.createElement('li')
      square.dataset.level = contributionCount
      squares.appendChild(square)
    })
  } catch (error) {
    console.error('Error fetching GitHub data:', error)
  }
}

getGitHubContributions()
// JavaScript code to scroll the container to the right on page load
window.addEventListener('load', function () {
  const container = document.querySelector('.graph.ContributionCalendar-label')
  if (container) {
    container.scrollLeft = container.scrollWidth // Scroll to the maximum right position
  }
})
