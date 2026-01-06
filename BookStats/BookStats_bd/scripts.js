document.addEventListener("DOMContentLoaded", function () {
    console.log("Скрипт загружен и запущен");

    // Проверяем, авторизован ли пользователь и задаем нужные для работы переменные
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const welcomeMessage = document.getElementById("welcome-message");
    const currentUserEmail = localStorage.getItem("currentUserEmail");
    const currentUserNickname = localStorage.getItem("currentUserNickname");
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

            const email = document.getElementById("loginEmail").value; // Получаем email
            const password = document.getElementById("loginPassword").value; // Получаем пароль

            fetch('/get.php', { method: 'GET' })
                .then(response => {
                    // Проверяем, успешен ли ответ
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.json(); // Парсим JSON-ответ
                })
                .then(data => {
                    if (data.status === 'success') {
                        const users = data.data; // Доступ к массиву users
                        // Ищем пользователя по e-mail и паролю
                        const user = users.find(user => user.email === email && user.password === password);

                        if (user) {
                            // Сохраняем данные пользователя в localStorage
                            localStorage.setItem("isLoggedIn", "true");
                            localStorage.setItem("currentUserEmail", email); // Сохраняем email текущего пользователя
                            localStorage.setItem("currentUserNickname", user.username); // Сохраняем никнейм текущего пользователя
                            console.log("Авторизация прошла успешно");
                            alert("Вы успешно вошли!");
                            window.location.href = "index.html";
                            
                        } else {
                            console.log("Неверные email или пароль");
                            alert("Неправильный email или пароль");
                        }
                    } else {
                        console.log("Ошибка при получении данных пользователей");
                        alert("Ошибка при получении данных пользователей");
                    }
                })
                .catch(error => {
                    console.error('Ошибка при выполнении запроса:', error);
                    console.error("Произошла ошибка:", error);
                });
        });
    }

    // Обработка формы регистрации
    const registerForm = document.querySelector('#register form');
        if (registerForm) {
            registerForm.addEventListener("submit", async function (event) {
                event.preventDefault();
                console.log("Форма регистрации отправлена");
                
                const nickname = document.getElementById("registerNickname").value;
                const email = document.getElementById("registerEmail").value;
                const password = document.getElementById("registerPassword").value;
                const confirmPassword = document.getElementById("confirmPassword").value;

                //Проверяем правильность повторного ввода пароля
                if (password !== confirmPassword) {
                    alert("Пароли не совпадают");
                    return;
                }

                fetch('/get.php',{method:'GET'})
                .then(response => {
                    // Проверяем, успешен ли ответ
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.json(); // Парсим JSON-ответ
                })
                .then(data => {
                    if (data.status === 'success') {
                        const users = data.data; // Доступ к массиву users
                        // Проверка на существование пользователя с такой почтой
                        const userExists = users.some(user => user.email === email);
                        if (userExists) {
                            alert('Пользователь с таким e-mail уже существует');
                        }
                        else {
                            const data1={nickname: nickname, email: email, password: password};
                            fetch('/post.php', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data1)})
                            .then(response => {
                              if (!response.ok) {
                                // Если сервер вернул ошибку, выбрасываем её
                                throw new Error('Ошибка сети');
                              }
                              return response.json();
                            })
                            .then(data=>{
                                if (data.status === 'success'){
                                     console.log(data.message);
                                }
                                else{
                                    console.log(data.message);
                                }
                            })
                            .catch(error => {
                              // Обработка ошибок
                              console.error('Произошла ошибка:', error);
                            });
                            alert('Регистрация прошла успешно');
                            window.location.href = 'auth.html';
                        }
                    }
                    else if (data.status === 'empty') {
                        const data1={nickname: nickname, email: email, password: password};
                        fetch('/post.php', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data1)})
                        .then(response => {
                          if (!response.ok) {
                            // Если сервер вернул ошибку, выбрасываем её
                            throw new Error('Ошибка сети');
                          }
                          return response.json();
                        })
                        .then(data=>{
                            if (data.status === 'success'){
                                 console.log(data.message);
                            }
                            else{
                                console.log(data.message);
                            }
                        })
                        .catch(error => {
                          // Обработка ошибок
                          console.error('Произошла ошибка:', error);
                        });
                        console.log('В базе нет пользователей');
                        alert('Регистрация прошла успешно');
                        window.location.href = 'auth.html';
                    }
                    else {
                        console.error('Ошибка: статус не успешный');
                        alert('Ошибка при регистрации. Попробуйте позже.');
                    }
                })
                .catch(error => {
                    console.error('Ошибка при выполнении запроса:', error);
                    alert('Ошибка при выполнении запроса. Проверьте консоль для подробностей.');
                });
            });
    }
    // Обработка выхода пользователя
    if (logoutLink) {
        logoutLink.addEventListener("click", function () {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("currentUserEmail");
            localStorage.removeItem("currentUserNickname");
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
        welcomeMessage.textContent = `Добро пожаловать в Book Stats, ${currentUserNickname}`; //обновляем приветственное сообщение
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

            // Проверяем, что пользователь заполнил все поля
            if (bookTitle && author && pages) {
                fetch(`/get_booklist.php?email=${encodeURIComponent(currentUserEmail)}`,{method:'GET'})
                .then(response => {
                    // Проверяем, успешен ли ответ
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.json(); // Парсим JSON-ответ
                })
                .then(data => {
                    if (data.status === 'success') {
                        const books = data.data; // Доступ к массиву books
                        // Проверка на то что у пользователя уже есть эта книга
                        const bookExists = books.some(book => book.bookname === bookTitle && book.author === author);
                        if (bookExists) {
                            alert('Данная книга уже присутствует в списке');
                            document.getElementById("bookTitle").value = "";
                            document.getElementById("author").value = "";
                            document.getElementById("pages").value = "";
                        }else{
                            const data1={email: currentUserEmail, bookname: bookTitle, author: author, pages: pages};
                            fetch('/post_booklist.php', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data1)})
                            .then(response => {
                              if (!response.ok) {
                                // Если сервер вернул ошибку, выбрасываем её
                                throw new Error('Ошибка сети');
                              }
                              return response.json();
                            })
                            .then(data=>{
                                if (data.status === 'success'){
                                     console.log(data.message);
                                }
                                else{
                                    console.log(data.message);
                                }
                            })
                            .catch(error => {
                              // Обработка ошибок
                              console.error('Произошла ошибка:', error);
                            });
                            document.getElementById("bookTitle").value = "";
                            document.getElementById("author").value = "";
                            document.getElementById("pages").value = "";
                            alert("Книга успешно добавлена!");
                        }
                    }else if(data.status === 'empty'){
                        const books = data.data; // Доступ к массиву books
                        const data1={email: currentUserEmail, bookname: bookTitle, author: author, pages: pages};
                            fetch('/post_booklist.php', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data1)})
                            .then(response => {
                              if (!response.ok) {
                                // Если сервер вернул ошибку, выбрасываем её
                                throw new Error('Ошибка сети');
                              }
                              return response.json();
                            })
                            .then(data=>{
                                if (data.status === 'success'){
                                     console.log(data.message);
                                }
                                else{
                                    console.log(data.message);
                                }
                            })
                            .catch(error => {
                              // Обработка ошибок
                              console.error('Произошла ошибка:', error);
                            });
                            document.getElementById("bookTitle").value = "";
                            document.getElementById("author").value = "";
                            document.getElementById("pages").value = "";
                            alert("Книга успешно добавлена!");
                    }
                    else {
                        console.error('Ошибка: статус не успешный');
                        alert('Ошибка при добавлении книги. Попробуйте позже.');
                    }
                })
                .catch(error => {
                    console.error('Ошибка при выполнении запроса:', error);
                    alert('Ошибка при выполнении запроса. Проверьте консоль для подробностей.');
                });
            } else {
                alert("Пожалуйста, заполните все поля формы.");
            }
        });
    }
});