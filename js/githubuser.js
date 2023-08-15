export class GithubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`

    return fetch(endpoint).then(data => data.json()).then(data => ({
      login: data.login,
      name: data.name,
      public_repos: data.public_repos,
      followers: data.followers
    })) //o group operator({}) faz com que a arrow function já retorne diretamente o objeto sem precisar da palavra reservada return
  }
}