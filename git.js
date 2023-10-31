let githubToken = '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'
let githubUsername = 'PawanSirsat'
let squares = document.querySelector('.squares')

document.addEventListener('DOMContentLoaded', function () {
  const fetchButton = document.getElementById('fetch-button')
  const usernameInput = document.getElementById('username')
  const userInfoDiv = document.getElementById('user-info')

  function getUserData(username) {
    if (username) {
      fetch(`https://api.github.com/users/${username}`)
        .then((response) => response.json())
        .then((data) => {
          userInfoDiv.innerHTML = `
            <h2>${data.name}</h2>
            <img src="${data.avatar_url}" alt="${data.login}" width="100">
            <p>Username: ${data.login}</p>
            <p>Followers: ${data.followers}</p>
            <p>Following: ${data.following}</p>
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
      console.log(`${contributionCount}`)
      squares.appendChild(square)
    })
  } catch (error) {
    console.error('Error fetching GitHub data:', error)
  }
}

getGitHubContributions()
