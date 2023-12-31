let githubToken = 'dsds'
let githubUsername = 'PawanSirsat'
const defaultUsername = 'PawanSirsat'

let squares = document.querySelector('.squares')
let userUrl = ''
let userLogin = ''
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
    if (username) {
      fetch(`https://api.github.com/users/${username}`)
        .then((response) => response.json())
        .then((data) => {
          datesegments = data.created_at.split('T').shift().split('-')
          userUrl = data.html_url
          userLogin = data.login
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
    getUserData(username)
  })

  // Automatically load data for a default GitHub user when the page loads
  getUserData(defaultUsername)
  getGitHubContributions()
})

// let query = `
//         query($userName: String!) {
//             user(login: $userName) {
//                 contributionsCollection {
//                     contributionCalendar {
//                         totalContributions
//                         weeks {
//                             contributionDays {
//                                 contributionCount
//                                 date
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//         `

async function getGitHubContributions() {
  try {
    const userContDiv = document.getElementById('user-contribution')
    const response = await fetch('contributions.json') // Assuming the JSON file is in the same

    if (!response.ok) {
      throw new Error('Failed to fetch JSON data')
    }

    const data = await response.json()
    const contributions = data.contributions.reverse() // Reverse the order of contributions
    const uyear = data.years[0].year
    const ucount = data.years[0].total

    contributions.forEach((contribution) => {
      const date = new Date(contribution.date)
      const day = date.getDate()
      const contributionCount = contribution.count
      const square = document.createElement('li')
      square.dataset.level = contributionCount
      square.style.backgroundColor = contribution.color
      squares.appendChild(square)
    })
    fetch(`https://api.github.com/users/${defaultUsername}`)
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error(
            `Failed to fetch data from GitHub API for user ${defaultUsername}`
          )
        }
      })
      .then((userData) => {
        // You can work with the userData here
        console.log(userData.login)
        userContDiv.innerHTML = `
    <span>${ucount} contributions in ${uyear}</span>
   <a href="${userData.html_url}" id="user-href" target="_blank" >@${userData.login}</a>
    `
      })
  } catch (error) {
    console.error('Error loading JSON data:', error)
  }
}

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
