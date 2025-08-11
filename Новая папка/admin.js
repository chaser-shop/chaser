const GITHUB_USERNAME = "ТВІЙ_НІК_НА_GITHUB";
const GITHUB_REPO = "НАЗВА_РЕПОЗИТОРІЮ";
const FILE_PATH = "products.json";
const BRANCH = "main"; // або "master"
const PASSWORD = "1234"; // свій пароль

let token = ""; // збережемо тут GitHub токен

document.getElementById('login').addEventListener('click', () => {
    const pass = document.getElementById('password').value;
    if (pass === PASSWORD) {
        token = prompt("Введи GitHub Token:");
        if (!token) return alert("Токен обов'язковий!");
        document.getElementById('admin-section').style.display = 'block';
        loadFlavors();
    } else {
        alert("Невірний пароль!");
    }
});

function loadFlavors() {
    fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${BRANCH}/${FILE_PATH}`)
        .then(r => r.json())
        .then(data => {
            document.getElementById('flavors').value = data.join("\n");
        });
}

document.getElementById('save').addEventListener('click', async () => {
    const flavors = document.getElementById('flavors').value.split("\n").map(f => f.trim()).filter(f => f);

    const fileContent = JSON.stringify(flavors, null, 4);
    const base64Content = btoa(unescape(encodeURIComponent(fileContent)));

    const fileData = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${FILE_PATH}`)
        .then(r => r.json());

    const result = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${FILE_PATH}`, {
        method: "PUT",
        headers: {
            "Authorization": `token ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "Оновлення списку смаків",
            content: base64Content,
            sha: fileData.sha,
            branch: BRANCH
        })
    });

    if (result.ok) {
        alert("Збережено!");
    } else {
        alert("Помилка збереження!");
    }
});
