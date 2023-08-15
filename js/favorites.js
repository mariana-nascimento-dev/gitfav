import { GithubUser } from "./githubuser.js"

// classe que vai conter a lógica dos dados, ou seja, como os dados serão estruturados
export class favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }


  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || [] // JSON.parse transforma a string para o conteúso que está dentro dela ex.: JSON.parse('[]') não retorna '[]' e sim [], ou seja, um array de verdade e não uma string array
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries)) //stringfy converte um valor do js para uma string como é no json
  }

  async add(username) {
    try {

      const userExists = this.entries.find(entry => entry.login === username)

      if(userExists) {
        throw new Error('User already registered!')
      }

      const user = await GithubUser.search(username)

      if(user.login === undefined) {
        throw new Error('User not found!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    } catch(error) {
      alert(error.message)
    }
  }

  delete(user) {
    //Higher-order functions (ex.: map, filter, find, reduce) é uma função que recebe uma outra como argumento, ou uma função que retorna outra função.
    const filteredEntries = this.entries
    .filter(entry => entry.login !== user.login)

    this.entries = filteredEntries
    this.update()
    this.save()
  }
}

//classe que vai criar a visualização e eventos do html
export class FavoritesView extends favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onadd()
  }

  onadd() {
    const addButton = this.root.querySelector('.search button')

    window.document.onkeyup = event => {
      if(event.key == 'Enter') {
        const {value} = this.root.querySelector('.search input')
        this.add(value)
      }
    }

    addButton.onclick =  () => {
      const {value} = this.root.querySelector('.search input')

      this.add(value)
    }
  }

  update() {
    this.emptyState()

    this.removeAllTr()

    this.entries.forEach(user => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `${user.name}'s image`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = `\\${user.login}`
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers
      row.querySelector('.remove').addEventListener('click', ()=> {
        const isOk = confirm('Are you sure you wanna delete this line? ') //confirm é um boolean
        if(isOk) {
          this.delete(user)
        }

      })

      this.tbody.append(row)//append é uma funcionalidade da DOM que recebe um elemento
    })
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
      <td class="user">
        <img src="https://github.com/mariana-nascimento-dev.png" alt="Mariana's image">
        <a href="https://github.com/mariana-nascimento-dev" target="_blank">
          <p>Mariana Nascimento</p>
          <span>/mariana-nascimento-dev</span>
        </a>
      </td>
      <td class="repositories">10</td>
      <td class="followers">8</td>
      <td>
        <button class="remove">Remove</button>
      </td>
    `

    return tr
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr')
      .forEach((tr) => {
        tr.remove()
      })
  }

  emptyState() {
    if (this.entries.length === 0) {
        this.root.querySelector('.empty-state').classList.remove('hide')
    } else {
        this.root.querySelector('.empty-state').classList.add('hide')
    }
}

}