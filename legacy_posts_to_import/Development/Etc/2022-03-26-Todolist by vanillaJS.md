---
title: "Todo list by Vanila JS"
date: 2022-03-26 11:30:00 +0900

  
excerpt: "Todolist web app 강의 정리"

categories: 
- Development
- etc

tag: 
- web
- javascript

---

# Todo list by Vanila JS

## 웹개발 공부 : 프롤로그

Web쪽 개발이 거의 업계에서는 주류인데 나는 게임클라이언트 프로그래머인관계로 이부분을 다뤄본적이 없었다. 뭐 코드를 보면 알아볼수는 있겠지만 제대로 한번은 훑어봐야하지않을까 싶어서 정리해본다. 뭐든 공부할때는 뭔가 만들어보면서하는게 제일인걸 알고있기에 가볍게 만들어볼걸 찾고있었는데, 구독하고있는 개발자 유튜버인 노마트코더에서 기본강의를 해주고있었던게 생각나서 그냥 머리식힐겸 슬슬보면서 todolist 정도부터 만들어보려고한다. 원래 다른영역인 웹 개발 공부를 한다고 하면 하나하나 차근차근 찾아보면서 해야겠지만 이렇게  누군가 커리큘럼도 잘 짜여져있는걸 그냥 따라만하면되니까 이렇게 편할수가없다.  컨텐츠 크리에이터에게 감사를 표하며 이번에는 쉽게쉽게 공부해보자. 

## 기본사항

Web 프론트 개발의 기본

- HTML
- CSS
- Javascript

기본적인 HTML과 CSS

```html

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="style.css">
        <title>Momentum</title>
    </head>
    <body>
        <h1 class="hello" id="title">grap me!</h1>
        <script src="app.js"></script>
        
    </body>
</html>
```

```css
body{
    background-color: burlywood;
}

h1{
    color: cornflowerblue;

}

.active
{
    color:tomato;
    
}
```

## Javascript 기본

- 브라우저에서 콘솔을 열면 인터프리터 언어처럼 작동한다.
- console.log(object) 가 콘솔 프린트 함수.
- Basic Data type
    - var : c#의 var과 동일. 변수생성. 자동타입설정
    - const: 상수설정
    - let: 변수 설정
    - var가 제일 먼저 나온것이고 const와 let이 나중에 추가된 개념. constant개념추가를 위해 도입된듯. 최근에는 그래서 var보다는 let 과 const위주로 사용. 대부분은 const로 설정하는게 기본이라고함.
    - 자료형은 기본적으로 정수형 실수형 boolean string등 존재. 파이썬처럼 언어 내부에서 컴파일시 설정하는듯. 따로 데이터타입을 가지고있지는 않은듯함. 이건 찾아봐야할듯

```jsx
const constTest=10
console.log("Const Test: "+constTest)
//constTest=11 //TypeError: Attempted to assign to readonly property.
//console.log("Const Test: "+constTest)

let variable="name"
console.log(variable+"is variable")

```

- Array
    - Array는 [] 로 설정. 파이썬과 비슷하다. array역시 const 와 let으로 설정하고 []로 구분한다.
    - 파이썬처럼 배열하나에 다른 타입의 변수를 담을수있다.
    
    ```jsx
    //Array Test
    
    const arrayTest=[1,2,3,4,5];
    
    for(var i =0; i<5; ++i)
    {
        console.log("Array Test "+i);
        console.log(arrayTest[i]);
    }
    
    const complexArrayTest=["strings",1,6.5];
    
    for(var i =0; i<3; ++i)
    {
        console.log("Complex rray Test "+i);
        console.log(complexArrayTest[i]);
    }
    ```
    
- Object
    - {} 로 설정. Struct 혹은 class 랑 비슷한 개념인것같다. 정확한건 찾아보자.
    - 형태는 json처럼 키-밸류 형태로 작성한다.
    - Object.Key로 접근 및 설정이 가능. json처럼 생겨서인지 Object[”Key”]로도 접근가능하다.
    - Object자체를 constant로 설정해도 내부의 값들은 설정이 가능하다. Object 전체 설정만 불가능.
    - 추후 Property 추가도 가능.
    - 함수추가도 가능. 함수설정은 기존 방식과 약간상이하다. 함수명을 먼저쓰고 function을 써준다.
    - this키워드로 멤버함수내 프로퍼티 접근이 가능하다.
    - new 키워드로 객체를 생성하는것도 물론가능하다.
    - delete키워드로 프로퍼티삭제가 가능하다.
    
    ```jsx
    
    //Object
    const Player=
    {
        hp: 100,
        name:"Ryoni",
        speed: 5.5,
        canSpell: false,
    		Attack:function()
        {
           console.log("Player Attack:"+this.name)
        }
    };
    
    console.log(Player.name); 
    console.log(Player["name"]);
    
    console.log(Player.hp);
    console.log(Player.canSpell);
    
    Player.name="hansol"; //ok
    //Player=true //error (constant)
    
    Player.lastName="Cho" //ok
    
    //Create Object by different method
    const Enemy =new Object();
    Enemy.hp=10;
    Enemy.name="Goblin";
    Enemy.canSpell=true;
    Enemy.mp=100;
    
    console.log("EnemyName:"+Enemy.name);
    console.log("Enemy mp:"+ Enemy.mp);
    
    delete Enemy.mp;
    console.log("delete Enemy Mp");
    console.log(Enemy.mp); //undefined
    
    //Method
    function foo()
    {
        console.log("foo");
    }
    ```
    

- Function
    - 함수는 대부분의 언어와 비슷한 형태
    - function이라는 예약어를 사용한다.
    - 메소드 오버로딩이없다. 대신 argument개수를 측정가능하다고한다. (arguments.length)

- 주요 내장함수
    - prompt:  사용자 입력을 받는 팝업을 생성하는 함수. 예전방식. 최근에는 이 함수를 사용하지는 않는다. 예전방식이 남아있는것.
    - typeof :data type 확인 (typeof value⇒이런식으로 씀. 물론 typeof(value)로 사용가능)
    - parseInt: string to int 형변환. 형변환함수는 parse로 시작하는듯. 정수형이 아닐경우에는 Nan을 반환
    - isNan: Nan인지 확인함수
    - 
- 조건문은 if, else 등 C와 동일하게 작성.
- Operator
    - &&, ||,!  논리연산자 모두 동일.
    - ==와 ===연산자가 존재한다. ===는 타입비교까지 하는 연산자. 그래서 ===를 더 많이사용한다. ==은 타입과 상관없이 value값으로 비교.

## Javascript on the Browser

- document: html문서자체 오브젝트. html을 가리키는 객체라고 볼수있다. 따라서 html의 값을 가져오는것도 설정하는것도 자바스크립트에서 가능하다. 위 객체는 브라우저에서 자동생성하여 제공한다.
- document.getElementById
- document.querySelector(”.hello h1”) : hello클래스의 h1중 첫번째것만 가져온다
- document.querySeletorAll : array로 다 들고온다.
- addEventListener : 이벤트리스너 추가
- 예시: h1.addEventListener(”click”,HandleTitleClick) 함수 이름만 넣어준다.
- 물론 onclick함수에 바로 콜백을 넣어줄수도 있다.
- window는 바로 접근이 가능하도록 제공이된다. resize 이벤트 예시는 아래코드에.

```jsx
const h1=document.getElementById("title");
console.log(h1);
console.dir(h1);

const h1_alter=document.querySelector(".hello");
console.log("h1 alter");
console.log(h1_alter);

h1.addEventListener("click",HandleTitleClick);
//h1.onclick=HandleTitleClick; //위와 동일
h1.addEventListener("mouseenter",OnMouseEnter_Title);
window.addEventListener("resize",OnWindowResized);
function HandleTitleClick()
{
    h1.innerText="Modified H1";
    h1_alter.style.color="blue";
    console.log("Title click!!");
}

function OnMouseEnter_Title()
{
    console.log("Mouse Enter");
}

function OnWindowResized()
{
    document.body.style.backgroundColor="tomato";
}
```

- html element의 이벤트함수를 알아보려면 MDN(Mozilla Develeper Network)에서 찾아볼수있다.
- 위에서 보면 h1의 style을 변경하고있는데, 자바스크립트에서 스타일을 변경할수는 있지만 이건 css의영역이기때문에 이렇게 하는것보다는 css에서 변경하게 하는게 좋다.

```css

body{
    background-color: burlywood;
}

h1{
    color: cornflowerblue;

}

.active
{
    color:tomato;
    
}
```

```jsx

const h1=document.querySelector(".hello");
h1.onclick=HandleTitleClick;
function HandleTitleClick()
{
    // h1.innerText="Modified H1";
    // h1_alter.style.color="blue";
    // console.log("Title click!!");

    h1.className="active";
}
```

- 위의 코드처럼 css에 대체할값을 넣어두고 class를 변경하는식으로 하는게 훨씬 나은코드라고한다.

```jsx
function HandleTitleClick()
{
    // h1.innerText="Modified H1";
    // h1_alter.style.color="blue";
    // console.log("Title click!!");
    const clickedClass="active"
    if(h1.classList.contains(clickedClass))
	{
        h1.classList.remove(clickedClass);
	}
    else{
        h1.classList.add(clickedClass);
    }
    
}
```

- 또한 이렇게 클래스이름을 바꿔주는것보다는 classlist을 활용하면 훨씬유용한코드가된다. 이름을 바로 바꿔주면 클래스 히스토리와 상관없이 아예 바뀌기때문이다.
- 이러한 기능은 굉장히 흔한것이라서 toggle로 자바스크립트에서 이미 제공하고있다.

```jsx
function HandleTitleClick()
{
    // h1.innerText="Modified H1";
    // h1_alter.style.color="blue";
    // console.log("Title click!!");
    // const clickedClass="active"
    // if(h1.classList.contains(clickedClass))
	// {
    //     h1.classList.remove(clickedClass);
	// }
    // else{
    //     h1.classList.add(clickedClass);
    // }

    const clickedClass="active";
    h1.classList.toggle(clickedClass);
    
}
```

## Make TODO List

### 코드

greettings.js

- 자바스크립트를 이용해서 html을 수정하는 가장 기본적인 것이 다 들어가있는 스크립트.
- 이 스크립트의 내용에 많은시간을 할애한것을 보면 가장 기본이 되는 내용이 많이 들어가있는것같다.

```jsx
const loginInput=document.querySelector("#login-form input");
const loginForm=document.querySelector('#login-form');
const greeting=document.querySelector("#greeting");

const HIDDEN_CLASS_NAME="hidden"; 
const USERNAME_KEY="username";

function OnLoginFormSubmit(event)
{
    event.preventDefault();
    loginForm.classList.add(HIDDEN_CLASS_NAME);
    const userName=loginInput.value;
    localStorage.setItem(USERNAME_KEY,userName);

    ShowGreeting();
   
} 

function ShowLoginForm()
{
    loginForm.classList.remove(HIDDEN_CLASS_NAME);
    loginForm.addEventListener("submit",OnLoginFormSubmit);

}

function ShowGreeting()
{
   
    const userName=localStorage.getItem(USERNAME_KEY);
    greeting.innerText=`Hello ${userName}`;
    greeting.classList.remove(HIDDEN_CLASS_NAME);
}

if(localStorage.getItem(USERNAME_KEY)===null)
{
    ShowLoginForm();
}
else
{
    
    ShowGreeting(); 
}
```

quotes.js

- 명언을 미리 배열에 저장해두고 랜덤하고 들고와서 뿌려주는 방식.
- 이런 명언을 랜덤하게 가져올수있는 api가 있을까? 일단 귀찮아서 이건그냥 로컬에 있는걸로 사용하게두었다. 시간날때 한번 찾아볼것.

```jsx
const quotes = [
    {
      quote: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney",
    },
    {
      quote: "Life is what happens when you're busy making other plans.",
      author: "John Lennon",
    },
    {
      quote:
        "The world is a book and those who do not travel read only one page.",
      author: "Saint Augustine",
    },
    {
      quote: "Life is either a daring adventure or nothing at all.",
      author: "Helen Keller",
    },
    {
      quote: "To Travel is to Live",
      author: "Hans Christian Andersen",
    },
    {
      quote: "Only a life lived for others is a life worthwhile.",
      author: "Albert Einstein",
    },
    {
      quote: "You only live once, but if you do it right, once is enough.",
      author: "Mae West",
    },
    {
      quote: "Never go on trips with anyone you do ntot love.",
      author: "Hemmingway",
    },
    {
      quote: "We wander for distraction, but we travel for fulfilment.",
      author: "Hilaire Belloc",
    },
    {
      quote: "Travel expands the mind and fills the gap.",
      author: "Sheda Savage",
    },
  ];

const quote = document.querySelector("#quote span:first-child");
const author = document.querySelector("#quote span:last-child");
const todaysQuote = quotes[Math.floor(Math.random() * quotes.length)];

 quote.innerText = todaysQuote.quote;
 author.innerText = todaysQuote.author;
```

clock.js

- interval 함수를 1초마다 활용하여 시계를 만든다.
- string 의 padStart함수를 활용해 1→01로 바꿔주는게 재미있는 파트였다.

```jsx
const clock=document.querySelector("#clock");

 function getCurrentTime()
 {
     const date= new Date();
     const hours = String(date.getHours()).padStart(2, "0");
     const minutes = String(date.getMinutes()).padStart(2, "0");
     const seconds = String(date.getSeconds()).padStart(2, "0");
     const currentTime=`${hours}:${minutes}:${seconds}`;

     clock.innerText=currentTime;
 }

getCurrentTime();
setInterval(getCurrentTime,1000);

```

todo.js

- Localstorage에 json형태로 저장하고 이를 가져오는 형식으로 구현하는형태.
- 배열에서 필터를 사용해서 해당 id의 값을 제거하고 새 배열을 만드는 방식이 재미있는 파트였다.
- 새 todolist를 저장할때는 date.now를 활용한 값을 id로 사용한다.

```jsx
const todoForm = document.getElementById("todo-form");
const todoInput= todoForm.querySelector("input");
const todoList=document.getElementById("todo-list");

const TODOS_KEY="todolist"
let todoArray=[];

function OnSubmitTodoForm(event)
{
    event.preventDefault();

    const newTodo=todoInput.value;
    todoInput.value="";
    
    const newTodoObject={
        id: Date.now(),
        text: newTodo,
    }
    todoArray.push(newTodoObject);
    ShowTodolist(newTodoObject);
    SaveTodoList_LocalStorage();
}
 
function SaveTodoList_LocalStorage()
{ 
    localStorage.setItem(TODOS_KEY,JSON.stringify(todoArray)); 
}

function ShowTodolist(newTodoObject)
{
    const li=document.createElement('li');
    li.id=newTodoObject.id;
    const span=document.createElement('span');
    const removeButton=document.createElement('button');
    removeButton.innerText='Remove';
    removeButton.addEventListener("click",RemoveTodoListItem);
    li.appendChild(span);
    li.appendChild(removeButton);

    span.innerText=newTodoObject.text;
    todoList.appendChild(li);

}

function RemoveTodoListItem(event)
{
    const parentListItem=event.target.parentElement;
    const tooListID=parentListItem.id;
    todoArray=todoArray.filter(item=>item.id!==parseInt(tooListID));

    parentListItem.remove();
    SaveTodoList_LocalStorage();
}

todoForm.addEventListener("submit",OnSubmitTodoForm);

const savedTodos=localStorage.getItem(TODOS_KEY);
if(savedTodos!==null)
{
    const parsedTodos=JSON.parse(savedTodos);
    todoArray=parsedTodos;
    parsedTodos.forEach((element)=>
    {
        ShowTodolist(element);
    });
}
```

background.js

- 이미지는 로컬에 있는 이미지를 사용하며 이미지파일이름을 배열에 넣어서 랜덤함수를 돌려서 html에 넣어주는 방식을 사용한다.
- 랜덤이미지를 가져오는 방식이라 일단 unsplash 에서 가져오는 방식으로 변경하였다.

```jsx
const images=[];//["0.jpg","1.jpg","2.jpg","3.jpg"];
const bgImage=document.createElement("img");

const randNum=GetRandomNumber(0,images.length-1);

if (images.length>0)
{
    const selectedImage=images[randNum];
    bgImage.src=`image/${selectedImage}`;
}
else
{
    bgImage.src="https://source.unsplash.com/random/1600*900"
}

document.body.appendChild(bgImage);

//Random Number(max inclusive)
function GetRandomNumber(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
```

weather.js

- openweatherAPI이용하여 날씨정보를 가져온다. GPS location은 자바스크립트 내장함수에서 가져올수있다.

```jsx
function onGeoLocationSuccess(info)
{
    const latitude=info.coords.latitude;
    const longitude=info.coords.longitude;
    const url=`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openWeatherAPIKey}&units=metric`
    fetch(url).then(response=>response.json().then(data=>
        {
            const locationName=data.name;
            const currentWeather=data.weather[0].main;

            const weather = document.querySelector("#weather span:first-child");
            const city=document.querySelector("#weather span:last-child");
            weather.innerText=currentWeather;
            city.innerText=locationName;

           
        }))
}

function onGeoLocationFail()
{
    alert("Could not display Weather");
}

navigator.geolocation.getCurrentPosition(onGeoLocationSuccess,onGeoLocationFail);
```

### 주요 함수

- localStorage : setItem,getItem,removeItem 등 키밸류로 로컬저장
- setInterval(함수,인터벌): 인터벌마다 함수호출
- setTimeout : 지정시간후 함수호출
- Date객체→ 시간관련객체
- padStart(2,”0”) : string length가 2가 아니라면 앞에 “0”을 붙여줌
- Math.random() ⇒0~1사이의 랜덤값반환. 따라서 정수형으로 랜덤값을 추출하려면 Math.floor를 해줘야한다.
- 랜덤값을 정수로 추출하는 함수는 요렇게 만들면 될것같다.

```jsx
//Random Number(max inclusive)
function GetRandomNumber(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
```

- fetch : url을 넣어서 response를 가져올수있는 함수.