---
title: "C# 스터디 (1):생성자"
date: 2021-10-29 14:53:00 +0900
header:
    overlay_color: "#000"
    overlay_filter: "0.5"
    overlay_image:  ../../assets/images/posts/writing.jpg
    teaser:  ../../assets/images/posts/writing.jpg  
excerpt: "C# 중급강의 정리용"

categories: 
- Development
- csharp
tag: 
- C#
- CSharp
- Language

---

# 참조타입(class)의 생성자 #1

## 객체 생성시 생성자


- 참조타입의 객체를 생성하면 “메모리가 먼저 0으로 초기화” 되고 생성자가 호출된다.


- 사용자가 생성자를 제공하지않으면 컴파일러는 매개변수가 없는 생성자 제공(.ctor)

- 예외사항
    - Abstract class : protected(family:IL)생성자
    - static class: 생성자가 제공되지않는다.

```c#
using System;

public class Point
{
    public int x;
    public int y;

    public Point(int x, int y) 
    {
        Console.WriteLine("Point Constructor");
        this.x = x; 
        this.y = y; 
    }
}
class Program
{
    static void Main(string[] args)
    {
        Point pt = new Point(1, 2);
        Console.WriteLine($"{pt.x}, {pt.y}");
    }
}
```

> Point 클래스의 객체 생성시 생성자를 설정. 메모리가 먼저 0으로 초기화된후 생성자가 호출된다. 



```c#
using System;

abstract class AAA { }
static class BBB { }

public class Point
{
    public int x;
    public int y;
        
    /*
    public Point(int x, int y)
    {
    } 
    */
}
class Program
{
    static void Main()
    {
        //Point pt = new Point(1, 2);

        Point pt = new Point();

        Console.WriteLine($"{pt.x}, {pt.y}");
    }
}
```

> 기존에 만들어놓았던 생성자를 제거해보았다. 매개변수가 없는 생성자를 컴파일러가 제공해주며 메모리는 0으로 초기화된다.  

<br>
<br>
<br>
<br>

---
<br>

## 상속과 생성자


- 파생클래스의 객체를 생성하면 
	- 기반클래스의 생성자가 먼저 호출된다.
	- 기본적으로는 인자없는 생성자가 호출된다. 
- 컴파일러는 파생클래스의 생성자안에서 기반클래스의 인자없는 생성자를 호출하는 코드가 추가된다. (아래 코드에서 :Base())
- 기반클래스의 인자있는 생성자를 호출되게 하려면 파생클래스에서 기반클래스의 생성자를 명시적으로 호출.
- 기반클래스에 인자없는 생성자가 없다면 반드시 파생클래스에서 기반클래스의 생성자를 명시적으로 호출해야한다.

```c#
using System;
using static System.Console;

class Base
{
   // public Base()      { WriteLine("Base()"); }
    public Base(int n) { WriteLine("Base(int)"); }
}
class Derived : Base
{
    public Derived()     : base(0) { WriteLine("Derived()"); }
    
    //컴파일러가 base()를 자동으로 넣어준다.
    public Derived(int n): base() { WriteLine("Derived(int)"); }
    //내가 이렇게 만들면 기반클래스의 인자있는 생성자를 호출한다. 
    public Derived(int n): base(n) { WriteLine("Derived(int)"); }
}
class Program
{
    public static void Main()
    {
        Derived d = new Derived(1);
    }
}
```
> 기반클래스와 파생클래스의 생성자 호출부분을 잘 살펴보자.

<br>
<br>

- 생성자를 protected에 놓으면
	- 자신은 객체를 생성할수없지만(추상적존재)
	- 파생클래스의 객체는 생성할수있다(구체적존재)
	- ***abstract로 두어도되지만 이때에는 컴파일러가 생성자를 안만듬.(기반클래스를 protected로 두는것이 경우에 따라서 괜찮을수있다)***

```c#
using System;

class Animal
{
    protected Animal() { }
}
class Dog : Animal
{
    public Dog() { }
}

class Program
{
    static void Main()
    {
        //# 다음중 에러는 ?
        //Animal a = new Animal(); // 1. error 외부에서는 부를수없다. 
        Dog    d = new Dog();    // 2. ok 자신의 생성자에서 부르기때문에 부를수있다.
    }
}
```
> 기반클래스의 생성자가 protected권한이기때문에 외부에서는 기반클래스에대한 객체생성이 불가능하다(추상적존재). 파생클래스의 객체는 생성이 가능하다.(구체적존재)


<br>
<br>
<br>
<br>

---
<br>

# 참조타입의 생성자 #2


```c#
using System;
using static System.Console;

class Base
{
    public Base() { Foo(); }

    public virtual void Foo() { WriteLine("Base.Foo"); }    
}
class Derived : Base
{
    public int a = 100;
    public int b;
    
    public Derived()
    {
        b = 100;
    }
    public override void Foo() 
    { WriteLine($"Derived.Foo : {a}, {b}"); }
}

class Program
{
    public static void Main()
    {
        Derived d = new Derived(); //이 순간 화면에서는 어떻게 출력될까?? ->100,0
    }
}
```
>  파생클래스에서 필드초기화를 한후 화면출력은 Foo함수에서 할때 해당함수를 기반클래스에서 호출한다면 a,b는 어떤 값이 들어가있을까? output은 100, 0 이다. 

<br>
<br>

## 생성자와 가상함수

- 초기화 순서
	- 필드초기화시 컴파일러는 이런식으로 코드를 바꿔서 이해한다.(아래 코드)


### 필드초기화의 원리 
- 초기화 순서
	- 필드초기화
	- 기반 클래스 생성자
	- 생성자안에 있는 초기화 코드 
- 따라서 **생성자안에서는 가상함수를 사용하지않는게 좋다**. 
- ***참고: c++에서는 생성자에서는 가상함수가 동작하지않는다. (생성자에서 가상함수를 불러도 기반클래스의 함수를 부름. 왜냐하면 자식클래스의 함수에서 초기화되지않은 변수들을 사용할수있기때문에)***


 **기존**
```c#
class Derived: Base
{
    public int a=100; //필드 초기화
    public int b;
    public Derived()
    {
        b=100;
    }
}
```
**변경**
```c#
class Derived: Base
{
    public int a;
    public int b;
    public Derived()
    {
        a=100;
        Base();
        b=100;
    }
}
```
> 이런식으로 필드초기화시 컴파일러는 코드를 바꿔서 이해한다.

<br>
<br>
<br>




### 가상함수의 선택적파라미터 (C++에서는 디폴트파라미터)

- 가상함수에서는 Optional Parameter를 사용하지말자
	- optional parameter는 컴파일 시간에 결정되고 가상함수 호출은 실행시간에 결정된다. 

```c#
using System;

class Base
{
    public virtual void Foo(int a = 10)
    {
        Console.WriteLine($"Base.Foo( {a} )");
    }
}
class Derived : Base
{
    public override void Foo(int a = 20)
    {
        Console.WriteLine($"Derived.Foo( {a} )");
    }
}
class Program
{
    public static void Main()
    {
        Base b = new Derived();
        b.Foo(); // 컴파일 할때 
                   //객체(실행시간에조사하는 코드).Foo(10)
        //b.foo() =>컴파일할때는 컴파일러는 b가 base로 인식. 실행시간에 바뀔수있는거라서..
    }
}
```

> 컴파일시 b는 Base로 인식된다. 런타임시 바뀔수있는것이기때문에 컴파일러는 선언당시의 객체로 인식을 한다. 따라서 선택적파라미터는 Base의 것으로 들어가게 된다. 



<br>
<br>
<br>
<br>

---
<br>

# 값타입의 생성자 #1

## 값타입과 참조타입의 생성자 비교
- Reference Type
	- 사용자가 "생성자를 제공하지않은경우, 컴파일러는 인자가 없는 생성자를 제공"한다. 
	- 사용자가 생성자를 제공하면, 컴파일러는 인자없는 생성자를 제공하지않는다.
- Value Type
	- 사용자가 인자가없는 생성자를 만들수없다. 
	- 컴파일러가 인자가 없는 생성자를 제공하지않는다. 
	- CLR  "값타입의 객체는 언제라도 생성할수있도록(생성자가 없어도) 허용"한다
- 정리
	- 참조타입: 객체를 만드려면 생성자가 필요하다. 사용자는 인자없는 생성자와 인자를 가지는 생성자 모두를 만들수있다. 
	- 값타입: 생성자가 없어도 객체를 만들수있다. 사용자는 인자를 가지는 생성자만 만들수있다.
	- =>C#언어만의 제약 : IL언어나 다른 .net언어에서는 값타입도 인자없는 생성자를 만들수있다. 
- 생성자 호출과 IL코드
	- 참조타입: newobj instance void CPoint::ctor(int32,int32) (인자있는 생성자 호출하여 객체생성)
	- 값타입: call instance void SPoint::ctor(int32,int32) (인자있는 생성자를 call) / initObj Spoint (초기화만)

```c#
using System;

class CPoint
{
    public int x;
    public int y;
    public CPoint(int a, int b) { x = a; y = b; }
}
struct SPoint
{
    public int x;
    public int y;
    //public SPoint() { }
    public SPoint(int a, int b) { x = a; y = b; }
}
class Program
{
    public static void Main()
    {
        CPoint cp1 = new CPoint(1, 2);  // ok
        //CPoint cp2 = new CPoint();     // error
        SPoint sp1 = new SPoint(1, 2);  //ok
        SPoint sp2 = new SPoint(); //ok      
    }
}
```
> 값타입의 생성자와 참조타입의 생성자 비교. 값타입의 생성자는 인자없는 생성자를 만들수없다(인자있는 생성자만 만들수있음)

<br>
<br>
<br>


## 값타입과 필드초기화 
- 필드초기화시에 인자없는 생성자에서 초기화를 진행한다고 알고있으나, 값타입은 인자없는 생성자를 만들수없다. 
- 따라서 값타입에서는 필드초기화를 사용할수없다. 


         
```c#
using System;

struct SPoint
{
    public int x;// = 0;
    public int y;// = 0;
}
class Program
{
    public static void Main()
    {
        SPoint sp1 = new SPoint();
    }
}
```

> 값타입은 필드초기화 사용이 불가능하다. 

<br>
<br>
<br>
<br>



## 값타입의 객체 생성방법과 초기화
- 아래 코드 참고 (값타입은 객체 생성시, new SPoint() 하게되면 초기화가 일어난다. )

```c#
using System;

class CPoint
{
    public int x;
    public int y;
}
struct SPoint
{
    public int x;
    public int y;
}

class Program
{
    public static void Main()
    {
        CPoint cp1;                 //# 객체 생성 아님. 참조 변수 생성
        CPoint cp2 = new CPoint();  //# 객체 생성.

        SPoint sp1;                 //# 객체 생성 (초기화안함)
        SPoint sp2 = new SPoint();  //# 객체 생성, initobj(모든멤버가 0으로 초기화됨)

        sp1.x = 10;
        sp2.x = 10;

        Console.WriteLine($"{sp1.x}");
        Console.WriteLine($"{sp2.x}");

    }
}
```
> 값타입은 객체 선언자체가 객체생성을 의미하며, new키워드는 생성한 객체에대한 초기화를 의미한다. 


```c#
using System;

struct SPoint
{
    public int x;
    public int y;
}
class CCircle
{
    public SPoint center;
}
struct SCircle
{
    public SPoint center;
}

class Program
{
    public static void Main()
    {
        CCircle cc1;                    //# 객체 아님. 참조 변수
        CCircle cc2 = new CCircle();    //# 객체 생성, 모든 멤버가 0으로 초기화(참조변수라면 null로 초기화)
        SCircle sc1;                    //# 객체 생성.
        SCircle sc2 = new SCircle();    //# 

        int n1 = cc1.center.x;  //# error. x가 메모리에 없음.
        int n2 = cc2.center.x;  //# ok. 0
        int n3 = sc1.center.x;  //# error. x가 초기화 안됨.(x가 메모리에 없는게아니라 초기화의 문제)
        int n4 = sc2.center.x;  //# ok.    x가 초기화 됨.

    }
}
```
> 주석을 참고하자. 값타입은 객체생성이 안되어서 메모리에없는게 아니라 초기화가 안되었다는데에 초점을 맞출필요가있다. 



<br>
<br>
<br>
<br>

---
<br>


# 값타입의 생성자 #2



## 값타입의 생성자 주의사항
- 참조타입의 객체생성시 모든멤버는 자동으로 0또는 null로 초기화된다. 
	- 즉 생성자안에서 모든멤버를 초기화하지않아도 된다.
- 값타입은 new없이 객체 생성시 자동으로 초기화 되지않는다. 
	- 반드시 "값타입의 생성자안에서는 모든멤버의 초기화를 제공"해야한다. 
- this
	- 참조타입은 상수
	- 값타입은 상수가 아님.

```c#
using System;

struct SPoint
{
    public int x;
    public int y;
    public int cnt;

    public SPoint(int a, int b)
    {
        //this = new SPoint(); //멤버변수가 너무 많을때 사용하던 방법. 좀이상하게 보여서 그냥 모든멤버초기화를 써주는게 낫다. 
        x = a;
        y = b;
        cnt = 0;
    }
}
class Program
{
    public static void Main()
    {
        SPoint pt = new SPoint(1, 2);
    }
}
```
> 값타입은 객체생성시 자동으로 초기화 되지않는다. 따라서 생성자안에 모든멤버의 초기화를 제공해야한다. 


<br>
<br>


```c#
using System;

class CPoint
{
    public int x;
    public int y;
    public CPoint(int a = 1, int b = 1) { x = a; y = b; }
}
struct SPoint
{
    public int x;
    public int y;
    public SPoint(int a = 1, int b = 1) { x = a; y = b; }
}
class Program
{
    public static void Main()
    {
        CPoint cp1 = new CPoint(5, 5); // newobj
        SPoint sp1 = new SPoint(5, 5); // call 생성자
        CPoint cp2 = new CPoint(2);         
        SPoint sp2 = new SPoint(2);
        CPoint cp3 = new CPoint();
        SPoint sp3 = new SPoint(); // initobj

        Console.WriteLine($"{cp1.x}, {cp1.y}"); // 5, 5
        Console.WriteLine($"{sp1.x}, {sp1.y}"); // 5, 5       
        Console.WriteLine($"{cp2.x}, {cp2.y}"); // 2, 1
        Console.WriteLine($"{sp2.x}, {sp2.y}"); // 2, 1
        Console.WriteLine($"{cp3.x}, {cp3.y}"); // 1, 1
        Console.WriteLine($"{sp3.x}, {sp3.y}"); // 0, 0 //값타입 초기화.
    }    
}
```
> 주석을 참고하자. 값타입의 생성자는 new시 initObj(IL code상에서)를 해준다. (참조타입생성자는 new 시 newObj) 

<br>
<br>
<br>
<br>

---
<br>

## Static생성자(타입생성자)

### Static생성자?
- 스태틱멤버를 생성자에서 초기화하면 문제가생길수있다. 
- 따라서 스태틱멤버는 생성자에서 초기화하지않고,스태틱생성자를 만들어 초기화한다. 
- 타입생성자(클래스 생성자, 정적생성자)
	- 생성자 앞에 static 이 붙는 문법
	- 접근지정자를 표기하지않는다 (컴파일러가 private을 자동으로 추가한다)
	- 인자없는 생성자만 만들수있다.
	- 여러개의 객체를 생성해도 단한번만 호출한다. 

```c#
using System;

class Point
{
    public int x;
    public int y;
    public static int cnt;

    public Point(int a, int b)
    {
        x = a;
        y = b;
//        cnt = 0;
    }
    static Point()
    {
        cnt = 0;
    }
}


class Program
{
    public static void Main()
    {
        Point pt1 = new Point(1, 1);
        Point pt2 = new Point(2, 2);
    }
}
```
> static 변수는 생성자에서 초기화하지않고 스태틱생성자를 만들어서 초기화한다. 이 스태틱생성자는 여러 객체를 생성한다고해도 단한번만 호출된다. 

<br>
<br>

### 타입생성자의 호출

- 객체를 생성하면 static 생성자가 먼저호출되고, instance생성자가 호출된다.
- 여러개의 객체를 생성해도 단한번만 호출된다. 
- 객체를 생성하거나 정적멤버에 접근하는 코드가 있으면 호출된다. 
- 멀티스레드 환경에도 안전(thread-safe)하다.
- 여러개의 타입의 static 생성자가 상호참조하는 코드를 작성하면 안된다. 


```c#
using System;

class Point
{
    public int x;
    public int y;
    public static int cnt;

    public Point(int a, int b) { Console.WriteLine("instance ctor"); }
    static Point() { cnt = 0;    Console.WriteLine("static ctor"); }
}
class Program
{
    public static void Main()
    {
        int n = Point.cnt;

        //    Point pt1 = new Point(1, 1);
        //    Point pt2 = new Point(1, 1);
        int n2 = A.a;
    }
}

class A
{
    public static int a;

    static A()
    {
        Console.WriteLine($"A : {B.b}");
        a = 10;
    }
}
class B
{
    public static int b;

    static B()
    {        
        Console.WriteLine($"B : {A.a}");
        b = 10;
    }
}
```

### 필드 초기화와 생성자
- 생성자 안에 멤버를 초기화하는 코드는 없지만 생성자 호출전에 메모리가 0으로 초기화된다. 
- 정적멤버는 필드초기화할경우 자동으로 스테틱생성자가 만들어진다. 
- 필드초기화와 정적생성자가 있을경우, 필드초기화부분이 먼저 일어나고 정적생성자초기화가 일어난다. 

```c#
using System;

class Point
{
    public int x = 0;
    public int y = 0;
    public static int cnt = 0;

    public Point()
    {
        x = 100;
        y = 100;
    }
    static Point()
    {
        cnt = 100;
    }

}
class Program
{
    public static void Main()
    {
        Point pt1 = new Point();
    }
}
```


- 값타입과 static 생성자
	- 값타입은 인자없는 인스턴스생성자는 만들수없지만 스태틱생성자는 만들수있다. 

```c#
using System;

struct Point
{
    public int x;
    public int y;
    public static int cnt = 0; //ok

 //   public Point() { } // error
 //   static Point() { } // ok
}

class Program
{
    public static void Main()
    {
        
    }
}
```


<br>
<br>
<br>
<br>

---
<br>

## Deconstructor(C#7.0)

- 객체의 필드값을 꺼낼때 사용
- Deconstuct라는 이름을 가지는 메소드. out parameter 사용
- 반환된 결과는 tuple로 받는다
- 소멸자(destory)와 혼동하지말것.
- C#에서 제공하는 기능.

```c#
using System;

class Point
{
    public int x;
    public int y;
    public Point(int a, int b) { x = a; y = b; }   
    
    public void Deconstruct(out int a, out int b)
    {
        a = x;
        b = y;
    }
}
class Program
{
    public static void Main()
    {
        Point pt = new Point(1, 2);

        int a = pt.x;
        int b = pt.y;

        var (a1, b1) = pt;

        pt.Deconstruct(out int a2, out int b2);

        Console.WriteLine($"{a1}, {b1}");
    }
}
```
