let githubToken = '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'
let githubUsername = 'PawanSirsat'

const query = `
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

    const squares = document.querySelector('.squares')
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
