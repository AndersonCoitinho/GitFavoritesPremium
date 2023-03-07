
class GithubUser {
    static search(username) {
        const endpoin = `https://api.github.com/users/${username}`

        return fetch(endpoin)
            .then(data => data.json()) //transforma em json
            .then(({ login, name, public_repos, followers }) => ({    //retorna objeto
                login,
                name,
                public_repos,
                followers
            }))
    }
}

//contendo a logica dos dados, como sao estruturados
export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()

        /*GithubUser.search('joao').then(user => console.log(user))*/
    }


    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []

    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))

    }


    delete(user) {
        const filteredEntries = this.entries
            .filter(entry => entry.login !== user.login)
        this.entries = filteredEntries
        this.update()
        this.save()
    }


}

//como vai ficar a vizualização html
export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)
        this.tbody = this.root.querySelector('table tbody')/*ia ser usando mais de 1 vez*/

        this.update()
        this.onadd()
    }

    onadd() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const input = this.root.querySelector('.search input')
            console.dir(input)
        }
    }


    update() {
        this.removeAllTr()

        this.entries.forEach(user => {
            const row = this.createRow()
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers
            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('Tem certeza que deseja deletar essa linha?')
                if (isOk) {
                    this.delete(user)
                }
            }

            this.tbody.append(row)
        })
    }

    createRow() {
        const tr = document.createElement('tr')

        tr.innerHTML = ` 
                        <td class="user">
                            <img src="https://github.com/andersoncoitinho.png" alt="Imagem do GitHub">
                            <a href="https://github.com/andersoncoitinho" target="_blank">
                                <div class="userdescription">
                                    <p>Anderson Coitinho</p>
                                    <span>andersoncoitinho</span>
                                </div>
                            </a>
                        </td>
                        <td class="repositories">
                            50
                        </td>
                        <td class="followers">
                            15
                        </td>
                        <td>
                            <button class="remove">Remover</button>
                        </td>
                    ` /*criando o tr novo*/

        return tr

    }

    removeAllTr() {
        this.tbody.querySelectorAll('tr')
            .forEach((tr) => { /*para cada "tr" ele vai executar*/
                tr.remove()  /*remove todos os tr*/
            })
    }

}
