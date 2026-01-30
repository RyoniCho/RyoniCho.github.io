---
title: "C# 스터디 (2): C# 최신문법"
date: 2021-11-01 00:00:00 +0900

excerpt: "C# 중급강의 정리용"

categories: 
- Development
- csharp
tag: 
- C#
- CSharp
- Language

---


# System.Index #1

int: Sequnces 접근을 위한 값만 보관

System.Index: Sequence접근을 위한 값과 방향을 보관

```c#
using System;


class Program
{
    static void Main(string[] args)
    {
        int[] arr={1,2,3,4,5,6,7,8,9,10};
        int n1=arr[2]; //3
        int n2=arr[^2]; //뒤에서부터 2번째(제로베이스가아님). =>9 

        Console.WriteLine($"{n1}, {n2}");
    }
}
```
> 인덱스 접근. ^2는 뒤에서부터 2번째를 의미하는데 사실 index객체를 만드는게 숨겨져있다. 

```c#
using System;


class Program
{
    static void Main(string[] args)
    {
        string s ="ABCDEFGHI";
        //# Sequence 요소에 접근하기위한 인덱스만들기
        int indx1=2;

        Index idx2 = new Index(2);
        //Index idx3 = new Index(2,true); //뒤에서 두번째
        Index idx3 = new Index(2,fromEnd:true); //뒤에서 두번째

        char c1= s[idx1]; //c
        char c2= s[idx2]; //c
        char c3= s[idx3]; //h

    
        Console.WriteLine($"{c1}");
    }
}
```
> 인덱스 객체를 명시적으로 만들어서 사용하는 방법. 


<br>
<br>
<br>

Index객체를 만드는방법(3가지방법)

```c#
class Program
{
    static void Main(string[] args)
    {
       //Index 객체 만들기1. new 사용
       Index i1 = new Index(3);
       Index i2 = new Index(3,fromEnd:true);

       
       //Index 객체 만들기2. 정적메소드 사용
       Index i3 = Index.FromStart(3);
       Index i4 = Index.FromEnd(3);

       //Index 객체 만들기3. 단축표기법 사용
       Index i5 = 3
       Index i6 = ^3;

    }
}
```

Value/IsFromEnd 속성

```c#
class Program
{
    static void Main(string[] args)
    {
       Index idx=^3;
       int n=idx.Value; //3
       bool b=idx.isFromEnd; //true

    }
}
```

<br>
<br>
<br>

# System.Index #2

## 사용자 정의 타입과 index

```c#
using System;

class Sentence
{
    private string[] words=null;
    public Sentence(string s) {words=s.Split();}
    public string this[int idx] {get{return words[idx];}} //indexer 문법
    public string this[Index idx] {get{return words[idx];}} //indexer 문법
}

class Program
{
    static void Main(string[] args)
    {
      Sentence sen= new Sentence("C# Program Study");
      string s2 =sen[1]; //indexer필요
      string s2=sen[^1]; //indexer에 Index를 받는것도 구현필요.


    }
}
```
> 인덱서 구현시 인덱스객체를 사용하려면 Index를 받는것도 구현하여야 한다. 

<br>
<br>
<br>


다만, 인덱스구현없이도 구현하는 방법이 존재한다. 
아래 코드를 참고하자.

컴파일러는 Length/Count 를 찾기때문에 이를 구현하면 Index를 위한 Indexer를 굳이 구현하지않아도된다.

```c#
using System;

class Sentence
{
    private string[] words=null;
    public Sentence(string s) {words=s.Split();}
    public string this[int idx] {get{return words[idx];}} 
    //public string this[Index idx] {get{return words[idx];}} 
    public int Length {get{return words.Length}}
}

class Program
{
    static void Main(string[] args)
    {
      Sentence sen= new Sentence("C# Program Study");
      string s2 =sen[1]; 
      string s2=sen[^1]; //error : 컴파일러=> 1. this[Index] 검색/ 2. sen[sen.Length-1] 검색 3. sen[sen.Count-1]검색


    }
}
```
> 즉, 사용자 정의 컬렉션에 "Index를 지원"하게 하려면 
>- 방법1. Index를 인자로 가지는 인덱서 제공
>- 방법2. Length또는 Count 속성 제공

<br>
<br>
<br>

# System.Range 

C# 8.0 에 추가된 기능이다. 파이썬등 최근언어에서는 자주 쓰이는 문법으로 구간을 나타내는 타입이다. 

```c#
using System;


class Program
{
    static void Main(string[] args)
    {
        string s1 ="ABCDEFGHIJ";
        
        char c= s1[2]; //C
        string s2=s1[2..7]; //CDEFG //뒤에꺼는 포함안됨.
        string s3=s1[2..^3]; //CDEFG    
    
        Console.WriteLine($"{c},{s2},{s3}");
    }
}
```
> .., ^등 으로 나타낼수있다.


System.Range:

2개의 인덱스를 가지고 하나의 구간을 나타내는 타입으로 객체를 만들어서 사용하는것도 가능하다. 

```c#
using System;


class Program
{
    static void Main(string[] args)
    {
       int[] arr1={1,2,3,4,5,6,7,8,9,10};
    
      //C# 8.0에서 추가된 System.Range 
      //Range r1=new Range();
       
        Range r1=new Range(new Index(2),new Index(2,true)); //3-8
        Range r2 =new Range(2,^2); //위와동일
        Range r1 =2..^2 //위와 동일한 표기법.

       int[] arr2=arr1[r1]
         
       foreach(var n in arr2)     
        Console.WriteLine($"{n}");
    }
}
```
> 인덱스와 마찬가지로 표기하는 방법은 여러가지이다. 단축표기를 사용하거나 range객체를 만들어서 표현할수있다. 


```c#
using System;


class Program
{
    static void Main(string[] args)
    {
        string s1 ="ABCDEFGHIJ";
        
        //1. new 사용
        Range r1 =new Range();
        Range r2=new Range(2,^2);

 //2.정적 메소드 사용
        Range r3 =Range.All;//ABCDEFGHIJ
        Range r4=Range.StartAt(4);//EFGHIJ
        Range r5=Range.EndAt(4); //ABCD

 //3.단축표기법
       
        Range r6 =2..7;
        Range r7=2..^2;
        Range r8=..4; //ABCD
        Range r9=4..; //EFGHIJ
        
        Console.WriteLine($"{c},{s2},{s3}");
    }
}
```
>Range를 사용하는 여러가지 방법.

<br>
<br>
<br>

# Pattern Matching

임의 개체가 특정패턴(모양,타입,값)을 만족하는지 조사하는것.

"r타입은 Rect타입인가? r은 정사각형인가? r의 x좌표는 10인가"

- type pattern matching : c#초기부터 지원. 7.0에서 기능추가
- var pattern matching :c# 7.0
- const pattern matching: c#7.0
- switch expression :c#8.0

```c#
using System;

class Shape { }

class Circle : Shape
{
    public double radius = 100;
}
class Program
{
    public static void Draw(Shape s)
    {

        /*
        //전통적인 is연산자.
        if ( s is Circle )
        {
            Circle c1 = (Circle)s;
            double d = c1.radius;
        }
        */

        //C# 7.0에서 추가된 새로운 표기법
        //if(객체 is 타입 변수)

        if (s is Circle c1)
        {
            double d = c1.radius;
        }

        // var pattern matching
        if (s is var c2) // var c2 = s
        {
            
        }



    }

    static void Main()
    {
        Draw(new Circle());       
    }
}
```
> c# 7.0 에서 추가된 새로운 표기법을 확인.

<br>
<br>
<br>


```c#
using System;

class Circle { }

class Program
{
    public static void Main()
    {
        object o = new Circle();

        if ( o is Circle c1) { } // type pattern matching
        if ( o is var c2)    { } // var pattern matching


        int n = 10;
        
        if ( n is 10 ) // const pattern matching
        {
        }

        if ( n == 10 )
        {
        }

        object obj = 10;

        //if ( obj == 10 ) // error
        //if (obj == (object)10) // ok  =>그러나 False. 참조변수 두개를 비교하면 값이 같은지 비교x

        if ((int)obj == 10) //unboxing해서 값비교
        {
            //Console.WriteLine("True");
        }
        //else
            //Console.WriteLine("False");

        if ( obj is 10) //요것도 unboxing해서 값비교하는것과 동일하게된다.
        {
        }
    }
}
```
> const/type/var 패턴매칭을 비교하여 확인. is 연산자를 사용할경우에 참조변수의 값을 언박싱해서 비교할수있다. 

<br>
<br>
<br>


## Switch와 패턴매칭

```c#
using System;

class Shape { }
class Circle : Shape { }

class Rectangle : Shape
{
    public double width = 100;
    public double height = 100;
}

class Program
{
    public static void Draw(Shape s)
    {
        switch (s)
        {
            // const pattern matching
            case null:
                break;

            // type pattern matching
            case Circle c:
                break;       


            case Rectangle r when r.width == r.height:
                break;
            
            case Rectangle r:
                break;

            default:
                break;
        }
    }


    public static void Main()
    {
        Draw(new Rectangle());

        //# 전통적인 switch 문의 구조
        int n = 1;
        switch (n)
        {
            case 1: 
                break;
            case 2: 
                break;
            default: 
                break;
        }
    }
}
```


```c#
using System;
using System.Collections.Generic;

class Shape { }
class Circle : Shape { }

class Rectangle : Shape
{
    public double width = 100;
    public double height = 100;
}

class Program
{
    public static List<Shape> group = new List<Shape>();

    public static void Draw(Shape s)
    {
        switch (s)
        {
            case var r when (group.Contains(r)) :
                break;

            case Rectangle r:
                break;

            default: break;
        }
    }




    public static void Main()
    {
        Draw(new Rectangle());

    }
}
```
<br>
<br>
<br>

## Switch Expression

Statement(문,문장)
- 프로그램을 구성하는 기본요소
- C#에서 하나의 문장은 ;로 종료된다.
- 언어에 따라 정의가 약간 다르다.

expression(표현식)
- 대부분의 언어가 유사한 정의를 사용.
- 하나의 값으로 계산되는식
- 연산자와 피연산자로 구성된다.
- return을 표기하지않아도 하나의 값으로 반환된다.

```c#
using System;

class Program
{   
    public int square(int n)
    {
        return n * n;
    }
    public int square2(int n) => n * n; //expression

    public static void Main()
    {
        int n = 50;

        //int s = n switch { 10 => 11, 20 => 22, 30 => 33, _ => 100  };

        int s = n switch { 
            10 => 11, 
            20 => 22, 
            30 => 33, 
            _ => 100 
        };

        Console.WriteLine(s);


        int k = 2 * 3 + 4 - n;


        //# 일반적인 switch 문의 구조 ( switch statement )
        switch(n)
        {
            case 10: break;
            case 20: break;
            default: break;
        }

    }
}
```


```c#
using System;

class Shape { }

class Rectangle : Shape 
{
    public double Width { set; get; } = 10;
    public double Height { set; get; } = 10;
}
class Circle : Shape
{
    public double Radius { set; get; } = 10;
}

class Point : Shape
{
    public double x = 0;
    public double y = 0;

    public void Deconstruct(out double ox, out double oy) => (ox, oy) = (x, y);
}

class Program
{
    public static void Main()
    {
        Shape s = new Circle();

        // type pattern matching
        double area = s switch 
        {
            null => 0,   // const pattern matching
            Point _ => 0,
            Circle c => Math.PI * c.Radius * c.Radius,
            Rectangle r => r.Width * r.Height,
            _ => 0
        };





        // tuple pattern
        int value1 = 0;
        int value2 = 0;

        var ret1 = (value1, value2) switch
        {
            (0, 0) => 0,
            var (a, b) when a > 100 => 100,
            var (a, b) when a <= 100 && b > 100 => 200,
            _ => 300
        };


        // positional pattern : Deconstructor 가 있는 타입
        Point pt = new Point();
        var (x1, y1) = pt;

        var ret2 = pt switch
        {
            (0, 0) => 0,
            var (a, b) when a > 100 => 100,
            var (a, b) when a <= 100 && b > 100 => 200,
            _ => 300
        };
    }
}
```

<br>
<br>
<br>

## Local Function

Local Function: 메소드안에 다시 메소드를 만드는 문법
- 자신이 포함된 메소드안에서만 호출할수있다. 

오류처리와 함수구현부를 분리할때 주로 사용
- iterator를 만들거나 비동기 메소드에서 주로 사용.

```c#
using System;

class Program
{
    public static void Foo()
    {
        int n = square(3);

        int square(int a)
        {
            return a * a;
        }
    }

    /*
    public static double div(double a, double b)
    {
        if (b == 0)
            throw new Exception("divide by zero");
        return a / b;
    }
    */
    /*
    public static double div(double a, double b)
    { 
        return a / b;
    }
    */
    public static double div_wrapper(double a, double b)
    {
        if (b == 0)
            throw new Exception("divide by zero");

        return div(a, b);

        double div(double a, double b)
        {
            return a / b;
        }
    }

    public static void Main()
    {
        double ret = div_wrapper(10, 0);
        Console.WriteLine(ret);
    }
}
```
<br>
<br>
<br>

- 실제 사용하는 예제.

```c#
using System;
using System.Collections;

// 1 ~ 5 까지의 숫자를 보관하는 컬렉션
class NumCollections : IEnumerable
{
    private int[] arr = new int[5] { 1, 2, 3, 4, 5 };

    public IEnumerator GetEnumerator()
    {
        // 오류만 확인..
        Console.WriteLine("arr 의 유효성 확인");
        if (arr == null) throw new Exception("null");

        return implementation();

        IEnumerator implementation()
        {
            foreach (int n in arr)
            {
                yield return n;
            }
        }
    }
}
class Program
{
    public static void Main()
    {
        NumCollections nums = new NumCollections();

        IEnumerator it = nums.GetEnumerator();
        Console.WriteLine("After GetEnumerator");

        while( it.MoveNext() )
        {
            Console.WriteLine(it.Current);
        }
    }
}
```


```c#
using System;

class Program
{
    public static int Foo(int a, int b)
    {
        int value = 10;

        return goo(10);

        static int goo(int n) //C# 8.0 static local fuction =>value,a,b접근불가.
        {
            return value + a + b + n;
        }
    }
    public static void Main()
    {
        Console.WriteLine(Foo(1, 2));
    }
}
```
<br>
<br>
<br>

# New Syntax in C# 8.0

## 디폴트인터페이스 멤버

```c#
using System;

interface ICamera
{
    void takePicture();
    //새롭게 추가된 인터페이스 함수 ->이렇게되면 인터페이스 상속하는 모든 것을 바꿔야함.그래서 인터페이스함수의 구현부를 만듬
    void uploadSNS()
    {
        Console.WriteLine("upload SNS");
    }
}

class Camera : ICamera
{
    public void takePicture()
    {
        Console.WriteLine("Take Picture With Camera");
    }
    public void uploadSNS()
    {
        Console.WriteLine("Camera upload SNS");
    }
}

class Program
{
    static void Main()
    {
        Camera c = new Camera();
        c.takePicture();
        c.uploadSNS(); //error

        ICamera ic = c;
        ic.uploadSNS(); //사용하려면 인터페이스로 캐스팅해서 사용.
    }
}
```
> 인터페이스 함수의 구현부를 만들수있다. 

<br>
<br>
<br>

## using 선언

```c#
using System;
using System.IO;
using static System.Console; // WriteLine("AA")

class Program
{
    static void Main()
    {
        FileStream f1 = new FileStream("a1.txt", FileMode.CreateNew);
        f1.Dispose();

        using (FileStream f2 = new FileStream("a2.txt", FileMode.CreateNew))
        {

        } // f2.Dispose
    }

    public static void Foo()
    {
        //+ C# 8.0
        using FileStream f3 = new FileStream("a3.txt", FileMode.CreateNew);
        
    } // f3.Dispose()
}
```
> using() 으로 묶던것을 그냥 using만 써도 된다. 

<br>
<br>
<br>

## Nullable Reference

```c#
using System;

class Program
{
    static void Main()
    {
        //int  n1 = null; // error
        //int? n2 = null;  // ok


#nullable enable       // 참조 타입 변수를 null 을 대입하면 경고..
        string s1 = null; // ok
        string? s2 = null;
#nullable disable 
        //int n = s1.Length;
    }
}
```


<br>
<br>
<br>

## null병합 대입
```c#
using System;

class Program
{
    public static void Main()
    {
        string s1 = null;

        //# C# 6.0 NULL 병합 연산자
        string s2 = s1 ?? "hello";


        //# C# 8.0 NULL 병합 대입
        s1 = "hello";

        s1 ??= "world";  // if ( s1 == null ) s1 = "world"

        Console.WriteLine(s1);

        
    }
}
```
