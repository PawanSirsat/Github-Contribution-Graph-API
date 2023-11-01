let githubToken = 'dsds'
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
]
// Fetch the contribution data for the user PawanSirsat

document.addEventListener('DOMContentLoaded', function () {
  const fetchButton = document.getElementById('fetch-button')
  const usernameInput = document.getElementById('username')
  const userInfoDiv = document.getElementById('user-info')

  async function getUserData(username) {
    const response2 = await fetch('contributions.json')
    if (!response2.ok) {
      throw new Error('Failed to fetch JSON data')
    }
    const data1 = await response2.json()
    console.log(data1)
    const countributions = data1.years

    if (username) {
      fetch(`https://api.github.com/users/${username}`)
        .then((response) => response.json())
        .then((data) => {
          datesegments = data.created_at.split('T').shift().split('-')

          console.log(data)
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
                                <p class="stat-title">${data1.years[0].year}</p>
                                <p id="repos" class="stat-value">${
                                  data1.years[0].total
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
                                <p id="location" style="opacity: 0.5;">${
                                  data.location
                                }</p>
                            </div>
                            <div class="profile-info">
                                <div class="bottom-icons" style="opacity: 0.5;"><img width="20" height="20" src="https://img.icons8.com/ios-filled/50/FFFFFF/link--v1.png" alt="link--v1"/></div>
                                <a href="${
                                  data.blog
                                }" id="page" style="opacity: 0.5;">${
            data.blog
          }</a>
                            </div>
                            <div class="profile-info">
                                <div class="bottom-icons"><img width="20" height="20" src="https://img.icons8.com/ios-filled/50/FFFFFF/twitter.png" alt="twitter"/></div>
                                <a href="https://twitter.com/${
                                  data.twitter_username
                                }" id="twitter">${data.twitter_username}</a>
                            </div>
                            <div class="profile-info">
                                <div class="bottom-icons" style="opacity: 0.5;"><img width="20" height="20" src="https://img.icons8.com/pastel-glyph/64/FFFFFF/company--v1.png" alt="company--v1"/></div>
                                <p id="company" style="opacity: 0.5;">${
                                  data.company
                                }</p>
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
    const response = await fetch('contributions.json') // Assuming the JSON file is in the same directory
    if (!response.ok) {
      throw new Error('Failed to fetch JSON data')
    }

    const data = await response.json()
    const contributions = data.contributions.reverse() // Reverse the order of contributions

    contributions.forEach((contribution) => {
      const date = new Date(contribution.date)
      const day = date.getDate()
      const contributionCount = contribution.count
      const square = document.createElement('li')
      square.dataset.level = contributionCount
      square.style.backgroundColor = contribution.color
      squares.appendChild(square)
    })
  } catch (error) {
    console.error('Error loading JSON data:', error)
  }
}

getGitHubContributions()
// JavaScript code to scroll the container to the right on page load
window.addEventListener('load', function () {
  const container = document.querySelector('.graph.ContributionCalendar-label')
  if (container) {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1 // Adding 1 because getMonth() returns a zero-based index

    // Define the scroll percentage for each month
    const scrollPositions = {
      1: 0, // January
      2: 0, // February
      3: 0, // March
      4: 0, // April
      5: 0, // May
      6: 30, // June
      7: 30, // July
      8: 40, // August
      9: 40, // September
      10: 40, // October
      11: 45, // November
      12: 100, // December
    }

    const scrollPercentage = scrollPositions[currentMonth]

    if (scrollPercentage !== undefined) {
      // Scroll to the specified percentage of the container's width
      container.scrollLeft = (container.scrollWidth * scrollPercentage) / 100
    }
  }
})
