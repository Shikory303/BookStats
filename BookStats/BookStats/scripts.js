document.addEventListener("DOMContentLoaded", function () {
    console.log("Скрипт загружен и запущен");

    // Проверяем, авторизован ли пользователь
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const welcomeMessage = document.getElementById("welcome-message");
    const currentUserEmail = localStorage.getItem("currentUserEmail");
    const stats = document.getElementById("stats");
    console.log("Статус авторизации:", isLoggedIn);

    const authLink = document.getElementById("auth-link");
    const logoutLink = document.getElementById("logout-link");

    if (authLink && logoutLink) {
        if (isLoggedIn === "true") {
            authLink.classList.add("d-none");  // Скрываем ссылку для входа/регистрации
            logoutLink.classList.remove("d-none");  // Показываем ссылку выхода
            console.log("Пользователь авторизован");
        } else {
            authLink.classList.remove("d-none");  // Показываем ссылку для входа/регистрации
            logoutLink.classList.add("d-none");  // Скрываем ссылку выхода
            console.log("Пользователь не авторизован");
        }
    }
    
    // Обработка формы входа
    const loginForm = document.querySelector('#login form'); // Находим форму входа
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            console.log("Форма входа отправлена");

            const nickname = document.getElementById("registerNickname").value; // Получаем никнейм
            const email = document.getElementById("loginEmail").value; // Получаем email
            const password = document.getElementById("loginPassword").value; // Получаем пароль

            // Получаем всех пользователей из localStorage
            const users = JSON.parse(localStorage.getItem("users")) || [];

            // Проверяем, существует ли пользователь с таким email и паролем
            const user = users.find(user => user.email === email && user.password === password);

            if (user) {
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("currentUserEmail", email); // Сохраняем email текущего пользователя
                alert("Вы успешно вошли!");
                window.location.href = "index.html";
            } else {
                alert("Неправильный email или пароль");
            }
        });
    }

    // Обработка формы регистрации
    const registerForm = document.querySelector('#register form'); // Находим форму регистрации
    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();
            console.log("Форма регистрации отправлена");

            const nickname = document.getElementById("registerNickname").value; // Получаем никнейм
            const email = document.getElementById("registerEmail").value; // Получаем email
            const password = document.getElementById("registerPassword").value; // Получаем пароль
            const confirmPassword = document.getElementById("confirmPassword").value; // Получаем подтверждение пароля

            if (password !== confirmPassword) {
                alert("Пароли не совпадают");
                return; // Прекращаем выполнение, если пароли не совпадают
            }

            // Получаем текущий массив пользователей или создаем новый
            const users = JSON.parse(localStorage.getItem("users")) || [];

            // Проверяем, существует ли уже пользователь с таким email
            const existingUser = users.find(user => user.email === email);
            if (existingUser) {
                alert("Пользователь с таким email уже зарегистрирован");
                return;
            }

            // Добавляем нового пользователя в массив
            users.push({ nickname, email, password });
            localStorage.setItem("users", JSON.stringify(users)); // Сохраняем пользователей в localStorage

            alert("Вы успешно зарегистрированы!");
            window.location.href = "auth.html"; // Перенаправляем на страницу авторизации
        });
    }
    // Обработка выхода пользователя
    if (logoutLink) {
        logoutLink.addEventListener("click", function () {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("currentUserEmail");
            alert("Вы вышли из аккаунта");
            window.location.href = "index.html";
        });
    }
    
    // Логика отображения формы для добавления книги и сообщения о необходимости авторизации
        const addBookForm = document.getElementById("add-book-form");
        const authMessage = document.getElementById("auth-message");

        if (isLoggedIn === "true") {
            // Получаем email из localStorage
            const users = JSON.parse(localStorage.getItem("users")) || [];
            const currentUserEmail = localStorage.getItem("currentUserEmail");

            // Находим текущего пользователя
            const currentUser = users.find(user => user.email === currentUserEmail);

            if (currentUser) {
                // Обновляем приветственное сообщение с никнеймом
                welcomeMessage.textContent = `Добро пожаловать в Book Stats, ${currentUser.nickname}`;
            }
            addBookForm.classList.remove("d-none"); // Показываем форму для добавления книги
            authMessage.classList.add("d-none"); // Скрываем сообщение об авторизации
        } else {
            addBookForm.classList.add("d-none"); // Скрываем форму для добавления книги
            authMessage.classList.remove("d-none"); // Показываем сообщение об авторизации
        }
     // Обработка формы добавления книги
    const bookForm = document.getElementById("bookForm");
    if (bookForm) {
        bookForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const bookTitle = document.getElementById("bookTitle").value;
            const author = document.getElementById("author").value;
            const pages = document.getElementById("pages").value;

            if (bookTitle && author && pages) {
                // Получаем книги всех пользователей
                const books = JSON.parse(localStorage.getItem("books")) || {};

                // Если текущий пользователь не имеет книг, создаем новый массив для него
                if (!books[currentUserEmail]) {
                    books[currentUserEmail] = [];
                }

                // Добавляем книгу для текущего пользователя
                books[currentUserEmail].push({ title: bookTitle, author: author, pages: pages });
                localStorage.setItem("books", JSON.stringify(books));

                // Очищаем форму
                document.getElementById("bookTitle").value = "";
                document.getElementById("author").value = "";
                document.getElementById("pages").value = "";

                alert("Книга успешно добавлена!");
            } else {
                alert("Пожалуйста, заполните все поля формы.");
            }
        });
    }
});