---
title: "C# 스터디 (3): 동시성(Concurrency)"
date: 2021-11-08 14:53:00 +0900
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

# Thread

## 전체 목차: Thread 개념/필요성/장점/오버헤드
C#에서 스레드를 만들고 사용하는 다양한 방법
- Thread 클래스
- Thread Pool 
- Task
- Async IO
- async,await 키워드


## Thread란?
- 코드를 실행하는 실행 흐름
- 프로세스 생성시 한개의 스레드가 생성 (주스레드-Primary Thread)
- 사용자가 추가로 생성할수있다. 

### 왜 스레드를 만드는가?
- 응답성이 좋은 UI프로그램. 주스레드에서는 사용자의 이벤트대기. 시간이 오래걸리는 작업은 다른 스레드로 진행한다.
- 성능좋은 프로그램: CPU가 4개라면 4개의 스레드를 사용하는것이 가장 좋다. 

### 스레드의 오버헤드
- CPU가 하나만 있다고 가정.
- 2개의 스레드가있다면 왔다갔다하면서 실행. (왼쪽/오른쪽 스레드)
- 스레드 생성시 OS는 내부적으로 Thread Kernel Object를 생성. 다양한 레지스터를 기록. 왼쪽을 수행을 하다가 오른쪽으로 옮길때는 cpu의 모든상태를 기록. 그리고 이동. 이러한과정을 context switch라고 한다. 이 context switch가 너무 일어나면 실제 작업보다 더 오래걸리는 오버헤드가 생김.
- 또한 스레드 하나 생성시 thread kernel object 이외에도 Thread Environment Block, Stack 메모리도 잡힘. 보통 스레드가 만들어지면 메모리사용량에대한 오버헤드도 잡힌다. 





# Thread클래스
- System.Threading namespace 필요
- Thread를 생성하는 방법
	- Thread t =new Thread(Foo);
	- t.Start();

```c#
using System;
using System.Threading;

class Program
{
    public static void Foo()
    {
        for (int i = 0; i < 10000; i++)
            Console.Write("1");
    }
    public static void Main()
    {
        Thread t = new Thread(Foo);
        t.Start();

        for (int i = 0; i < 10000; i++)
        {
            Console.Write("2");
        }
    }
}
```
> Output: 1과 2가 번갈아가면서 출력됨을 알수있다. 
>22222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222122222222111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111122222222...






## Thread 로 실행할 메소드 모양
- Thread클래스의 생성자 모양
	- public Thread(ParameterizedThreadStart start);
	- public Thread(ThreadStart start);
	- public Thread(ParameterizedThreadStart start,int maxStackSize);
	- public Thread(ThreadStart start,int maxStackSize);
- 스레드로 수행할 메소드(delegate)모양
	- delegate void ThreadStart()
	- delegate void ParameterizedThreadStart(object? obj)
- 메소드의 모양이 다른경우, 람다 표현식을 사용해서 전달
- stack크기를 전달하지않거나 0을 전달하면 실행파일 헤더(PE)에 기록된 스택크기(1메가)사용


```c#
using System;
using System.Threading;

class Program
{
    public static void F1()             { Console.WriteLine($"F1"); }
    public static void F2(object? obj)  { Console.WriteLine($"F2 : {obj.ToString()}"); }
    public static void F3(object obj)   { Console.WriteLine($"F3 : {obj.ToString()}"); }
    public static void F4(string msg)   { Console.WriteLine($"F4 : {msg}"); }
    public static void F5(int a, int b) { Console.WriteLine($"F5 : {a}, {b}"); }

    public static void Main()
    {
        Thread t1 = new Thread(F1); t1.Start();

        Thread t2 = new Thread(F2); t2.Start("Hello");
        Thread t3 = new Thread(F3); t3.Start("Hello");
        //Thread t4 = new Thread(F4); // error 

        Thread t4 = new Thread(() => F4("Hello"));
        t4.Start();

        Thread t5 = new Thread((arg) => F4((string)arg));
        t5.Start("Hello");

        Thread t6 = new Thread(() => F5(1,2));
        t6.Start();
    }
}
```
> 정리
>- 인자가 없는 메소드
>- object 또는 object? 를 인자로 가지는 메소드
>- 메소드모양이 다른경우 일반적으로 람다표현식을사용하여 전달한다. 



## 스레드와 람다표현식(주의할점)

```c#
using System;
using System.Threading;

class Program
{
    static void Foo(int n)
    {
        Console.WriteLine(n);
    }
    public static void Main()
    {
        for (int i = 0; i < 20; i++)
        {
            //Foo(i);
            //이렇게 하면 중복되는 현상이 일어난다. 람다표현식이 지역변수를 캡쳐
            //Thread t = new Thread(() => Foo(i));

            int temp = i;
            Thread t = new Thread(() => Foo(temp));
            t.Start();
        }
    }
}
```
> 주석한 부분처럼 했을때 Output: 2 2 4 7 3 9 4 6 6 9 11 12 13 14 14 16 17 18 19 20 => 람다표현식이 지역변수를 캡쳐하는경우가 생김. 


## Thread 클래스의 다양한 멤버

- t1.ManagedThread :스레드 ID 얻기
- t1.isAlive  :스레드가 아직 실행중인가
- t1.Name: 스레드 이름. 한번만 설정할수있다.
- t1.isThreadPoolThread :Thread Pool 강좌 참조
- t1.IsBackground :백그라운드 스레드 여부
- t1.Join :스레드 종료시까지 대기
- Thread.CurrentThread: 현재 스레드의 참조 반환
- Thread.Sleep() :스레드 대기


```c#
using System;
using System.Threading;

class Program
{
    public static void Foo()
    {
        // 자신의 참조가 필요하면
        Thread t = Thread.CurrentThread;
        Console.WriteLine($"{t.ManagedThreadId}");

        Console.WriteLine("Foo");
        Thread.Sleep(2000);
    }

    public static void Main()
    {
        Thread t1 = new Thread(Foo);
        t1.Start();

        t1.Name = "AAA"; //이름은 한번만 설정가능하다. 
        //t1.Name = "BBB"; // runtime rror

        Console.WriteLine($"{t1.IsAlive}");
        Console.WriteLine($"{t1.ManagedThreadId}");

        t1.Join();

    }
}
```

## 백그라운드 스레드
- 프로세스 종료조건
	- 프로세스 내의 모든 Foreground 스레드가 종료될때.
    - 즉 자신의 스레드가 종료되는 조건이 안되었어도 Foreground 스레드가 모두 종료되면 그냥 종료된다. (완전한 처리후의 종료가 보장되지않을수있다. )

```c#
using System;
using System.Threading;

class Program
{
    public static void Foo(string s, int ms)
    {
        Console.WriteLine($"{s} Start");
        Thread.Sleep(ms);
        Console.WriteLine($"{s} Finish");
    }

    public static void Main()
    {
        Thread t1 = new Thread(() => Foo("A", 3000));
        t1.IsBackground = false; // foreground
        t1.Start();

        Thread t2 = new Thread(() => Foo("B", 9000));
        t2.IsBackground = true; // background
        t2.Start();

        Thread t3 = new Thread(() => Foo("C", 7000));
        t3.IsBackground = false; // foreground
        t3.Start();

        Thread t4 = new Thread(() => Foo("D", 5000));
        t4.IsBackground = true; // background
        t4.Start();
        // 주 스레드가 종료!!
//Foreground thread가 모두 종료되는 7초뒤에 프로세스가 종료된다. 9초짜리 백그라운드 스레드는 종료가 보장되지않는다.
    }
}
```
>Output:
> A Start
C Start
B Start
D Start
A Finish
D Finish
C Finish

> => 9초짜리 B스레드는 종료가 보장되지않는다. 백그라운드스레드라서 포어그라운드 스레드가 7초뒤에 모두 종료되는순간 그냥 종료된다. 

<br>
<br>

## Cooperative Cancellation

- 스레드가 수행하는 작업을 취소하고싶다. 
	- 스레드를 강제로 종료하면 안된다. 
	- 두 스레드간의 약속된 방식이 필요하다. 
	- 예를 들어 변수를 하나 두고, 스레드에서 취소요청이 있는지 확인.=>c#에서는 공통적인 규칙을 만듬
	- CancellationToken(System.Threading.CancellationToken)
	- CancellationTokenSource ->이안에 token 이 들어있음. 
	- 협력적 취소.(Cooperative Cancellation)


예시소스코드 (Count라는 메소드를 실행하는 스레드를 취소해보기)

```c#
using System;
using System.Threading;

class Program
{
    public static void Count(int cnt)
    {
        for (int i = 0; i < cnt; i++)
        {
            Console.WriteLine(i);
            Thread.Sleep(200);
        }
    }
    public static void Main()
    {
        Thread t = new Thread(o => Count(1000));
        t.Start();

    }
}
```

```c#
using System;
using System.Threading;

class Program
{
    public static void Count(CancellationToken token,  int cnt)
    {
        for (int i = 0; i < cnt; i++)
        {
            if ( token.IsCancellationRequested)
            {
                Console.WriteLine("Cancelling");
                break;
            }
            Console.WriteLine(i);
            Thread.Sleep(200);
        }
        if (token.IsCancellationRequested)
        {
            Console.WriteLine("Cancelled");
        }
        else
            Console.WriteLine("Finish Count");

    }


    public static void Main()
    {
        CancellationTokenSource cts = new CancellationTokenSource();

        //Thread t = new Thread(o => Count(cts.Token, 1000));
        
        //CancellationToken.None: 절대취소할수없는 토큰
        Thread t = new Thread(o => Count(CancellationToken.None, 1000));
        t.Start();

        Console.ReadLine();
        cts.Cancel();
    }
}
```
>정리
>- 스레드가 수행하는 메소드에서 
>	- cancellationToken을 인자로 받아야한다.
>	- 작업을 수행하면서 취소요청이 왔는지 주기적으로 확인해야한다.
>- 스레드를 생성할때
>	- cancellationTokenSource객체를 생성한후
>	- Thread메소드에 cancellationToken을 전달
>	- 취소하고싶을때 TokenSource의 Cancel()메소드 호출


```c#
using System;
using System.Threading;

class Program
{
    public static void Count(CancellationToken token, int cnt)
    {
        for (int i = 0; i < cnt; i++)
        {
            if (token.IsCancellationRequested)
            {
                Console.WriteLine("Cancelling");
                break;
            }
            Console.WriteLine(i);
            Thread.Sleep(200);
        }
        if (token.IsCancellationRequested)
        {
            Console.WriteLine("Cancelled");
        }
        else
            Console.WriteLine("Finish Count");

    }


    public static void Main()
    {
        CancellationTokenSource cts = new CancellationTokenSource();

        CancellationTokenRegistration m1 = cts.Token.Register(() => Console.WriteLine("Cancelled 1"));
        cts.Token.Register(() => Console.WriteLine("Cancelled 2"));

        m1.Dispose(); // 등록된 함수 제거.

        Thread t = new Thread(o => Count(cts.Token, 1000));
        t.Start();

        cts.CancelAfter(2000);


        Console.ReadLine();
        //cts.Cancel();
    }
}
```
>- 취소 메시지를 전달하는 방법
>	- cts.Cancel();
>	- cts.CancelAfter(시간);
>- Callback 함수 등록
>	- cancellationToken 의 Register메소드를 사용해서 취소 발생시 호출될 메소드 등록가능


```c#
using System;
using System.Threading;

class Program
{
    public static void Count(CancellationToken token, int cnt)
    {
        for (int i = 0; i < cnt; i++)
        {
            if (token.IsCancellationRequested)
            {
                Console.WriteLine("Cancelling");
                break;
            }
            Console.WriteLine(i);
            Thread.Sleep(200);
        }
        if (token.IsCancellationRequested)
        {
            Console.WriteLine("Cancelled");
        }
        else
            Console.WriteLine("Finish Count");

    }


    public static void Main()
    {
        CancellationTokenSource cts1 = new CancellationTokenSource();
        cts1.Token.Register(() => Console.WriteLine("Cancel 1"));

        CancellationTokenSource cts2 = new CancellationTokenSource();
        cts2.Token.Register(() => Console.WriteLine("Cancel 2"));

        CancellationTokenSource cts = CancellationTokenSource.CreateLinkedTokenSource(cts1.Token,
                                        cts2.Token);


        Thread t = new Thread(o => Count(cts.Token, 1000));
        t.Start();

        Console.ReadLine();
        cts2.Cancel();
    }
}
```
>- thread Token 2개->1개로 링크시킬수있다.
>	- 이경우 1개의 토큰만 취소요청이와도 스레드가 취소된다. 
>	- 이런식으로 취소조건을 여러개를 사용할수있다. 


<br>
<br>
<br>
==

# Thread Pool


- 스레드 생성시 참고사항
	- 스레드 생성 및 파괴에는 오버헤드가 있다.
	- 스레드생성시 생성되는것들(Thread Kernal Object/Thread Environmment Block/Stack)
	- 스레드 생성/파괴를 반복하는것보다 하나의 스레드를 대기/실행하도록 하는것이 좋다. 
	- 몇개의 스레드를 만들것인가??
		- 응용프로그램은 아주 다양한 환경에서 실행될수있다. (CPU 코어갯수는 유저환경에따라 달라진다.)
- ThreadPool
	- 스레드로 수행할 작업을 스레드풀의 Queue에 넣는다. 
	- ThreadPool.QueueUserWorkItem
	- 작업을 마친 스레드는 즉시 파괴되지않고, 다음작업을 위해 대기한다.
	- CLR이 현재 시스템 환경을 고려해서 최적의 개수의 스레드를 관리한다. 

```c#
using System;
using System.Threading;

public static class Program
{
    private static void Foo(object arg)
    {
        Console.WriteLine($"Foo : {arg}, {Thread.CurrentThread.ManagedThreadId}");
        Thread.Sleep(1000);

        Console.WriteLine($"{Thread.CurrentThread.IsThreadPoolThread}");

        Console.WriteLine("Finish Foo");

        Console.ReadLine();
    }

    public static void Main()
    {
        //사용자가 직접만든 스레드
        //Thread t = new Thread(Foo);
        //t.Start("Hello");
        //t.Name = "AA";
        
        //직접만드는게 아니라 thread pool이용.
        //ThreadPool.QueueUserWorkItem(Foo, "Hello");
        ThreadPool.QueueUserWorkItem(Foo); // arg 에 null 


        Console.ReadLine();
    }
}
```

## Thread Pool에있는 스레드의 특징

- 항상 Background Thread 이다. 
- Name필드를 설정할수없다.
- Block 되는 코드는 사용하면 성능이 떨어진다.
- Thread.CurrentThread.IsThreadPoolThread 속성으로 조사가능.

```c#
using System;
using System.Threading;

public static class Program
{
    private static void Foo(object arg)
    {
        Console.WriteLine($"Foo : {arg}, {Thread.CurrentThread.ManagedThreadId}");
        Thread.Sleep(1000);

        Console.WriteLine($"{Thread.CurrentThread.IsThreadPoolThread}");

        Console.WriteLine("Finish Foo");

        Console.ReadLine(); //이렇게 block되는 코드는 pool 로사용하지않는게 좋다.
    }

    public static void Main()
    {
        //Thread t = new Thread(Foo);
        //t.Start("Hello");
        //t.Name = "AA";

        //ThreadPool.QueueUserWorkItem(Foo, "Hello");
        ThreadPool.QueueUserWorkItem(Foo); // arg 에 null 


        Console.ReadLine();
    }
}
```
<br>
<br>
<br>



# Task


- 스레드가 종료되는걸 대기할때.
	- Thread 클래스는 종료대기가 가능. pool은 불가능
	- Thread 반환값 얻기=> Thread클래스/ThreadPool모두 불가능
	- 연속실행(주스레드 이벤트처리) => 둘다 불가능. 

```c#
using System;
using System.Threading;

class Program
{    
    public static void Foo(object arg)
    {
        Console.WriteLine("Foo");
        //return 100;
    }

    public static void Main()
    {
        Thread t1 = new Thread(Foo);
        t1.Start("Hello");
        t1.Join(); // 스레드 종료 대기.

        ThreadPool.QueueUserWorkItem(Foo, "Hello");    
    }
}
```

## Task의 사용

- Task vs Task<T>
- 스레드가 수행할 메소드 모양
	- Task: Action, Action<object?> :반환값이 없는 메소드
	- Task: Func<T>,Func<object?,T>: 반환값이 있는 메소드.


```c#
using System;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    static void F1()           { Console.WriteLine("F1"); }
    static void F2(object obj) { Console.WriteLine("F2"); }
    static int  F3()           { Console.WriteLine("F3"); return 100; }
    static int  F4(object obj) { Console.WriteLine("F4"); Thread.Sleep(3000); return 200; }

    static void Main()
    {
        Task t1 = new Task(F1);
        t1.Start();

        Task t2 = new Task(F2, "Hello");
        t2.Start();

        Task<int> t3 = new Task<int>(F3);
        t3.Start();

        Task<int> t4 = new Task<int>(F4, "Hello");
        t4.Start();

        //t4.Wait(); // Join()과 같다.

        Console.WriteLine($"{t4.Result}"); //반환값 얻기. 스레드가 끝나지않으면 대기후 결과값을 가져옴. 
    }
}
```

## Task 클래스로 스레드를 생성하는방법
- new Task(F1).Start();
- Task.Run(F1) //정적 메소드 사용. 바로 Start까지 호출된다. 인자가없는 메소드만 가능. 람다사용으로 인자있는 메소드를 사용가능. 

```c#
using System;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    static void F1()           { Console.WriteLine("F1"); }
    static void F2(object obj) { Console.WriteLine("F1"); }
    static int  F3(object obj) { Console.WriteLine("F2"); return 100; }

    static void Main()
    {
        Task t1 = new Task(F1);         t1.Start();
        Task t2 = new Task(F2, "Hello");t2.Start();

        Task<int> t3 = new Task<int>(F3, "Hello"); t3.Start();


        Task t4 = Task.Run(F1);
        Task t5 = Task.Run(() => F2("Hello"));

        Task<int> t6 = Task.Run(() => F3("Hello"));


    }
}
```
> Task를 new로 생성하거나, 정적메소드 Run으로 생성할수있다. 


```c#
using System;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    static void F1() 
    {
        Console.WriteLine($"{Thread.CurrentThread.IsThreadPoolThread}");
        Console.WriteLine($"{Thread.CurrentThread.IsBackground}");
    }

    static void Main()
    {
        //Task t1 = new Task(F1); 
        Task t1 = new Task(F1, TaskCreationOptions.LongRunning);//오랜시간으로 작업하는 스레드. 풀스레드로 만들지않는다. 

        t1.Start();
        t1.Wait();

        Task t2 = Task.Run(F1); //항상 스레드풀로사용.
    }
}
```
> Task로 생성되는 스레드는 스레드풀에서 생성되어 백그라운드 스레드이다. 이때 TaskCreationOptions.LongRunning옵션을 사용하여 Task를 생성하면 스레드풀이아닌 별도의 전용스레드를 생성할수있다. 해당 옵션은 정적메소드로는 사용할수없다. 


## Thread 연속 실행
어떤 스레드의 결과를 가지고 다른스레드가 처리되어야할때, Block이 발생하지않고 연속적으로 처리하는 방법.

가정: 주스레드가 GUI이벤트를 처리해야한다. 절대 Block이 발생하면 안된다. 
- 스레드 A: 임의의 연산을 수행한다. 
- A가 종료되면 A의 연산결과를 가지고 새로운 연산을 수행한다. 

```c#
using System;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    public static int Sum(int cnt)
    {
        int s = 0;
        for (int i = 0; i <= cnt; i++)
            s += i;
        return s;
    }

    public static void Main()
    {
        Task<int> t = Task.Run(() => Sum(1000));

        t.ContinueWith(메소드);

        // 아래 2줄은 주스레드가 Block 되게 된다.
        //t.Wait();
        //int n = t.Result;
    }
}
```
> 주석한부분처럼 wait로 기다리고 t.Result로 결과를 가져오게되면 Block이 발생하게된다. 따라서 ContinueWith를 사용한다. 

### task.ContinueWith(메소드) 
- 여기들어가는 method는 task를 인자로 받아야함.



```c#
using System;
using System.Threading;
using System.Threading.Tasks;

class Program
{  
    public static int Sum(int cnt)
    {
        int s = 0;
        for( int i = 0; i <= cnt; i++)
            s += i;
        Console.WriteLine("Finish Sum");
        return s;
    }
    public static void Main()
    {
        Task<int> t = Task.Run( () => Sum(1000) );

        t.ContinueWith(Foo);
        //여러개 등록도 가능. 
        t.ContinueWith(Goo);
        t.ContinueWith((task) => Console.WriteLine("lambda"));

        Console.ReadLine();
    }

    public static void Foo(Task<int> t)
    {
        Console.WriteLine($"Foo : {t.Result}");
    }
    public static void Goo(Task<int> t)
    {
        Console.WriteLine($"Goo : {t.Result}");
    }
}
```

- Sum실행이 종료되면 Foo,Goo메소드가 thread pool Queue에 놓인다. 
- Foo,Goo는 Sum을 수행한 스레드가 수행할수도있고 풀내의 다른 스레드일수도있다. 
- 아래 코드를 실행해보면 스레드ID가 같을때도 있고 다를때도있다. 


```c#
using System;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    public static int Sum(int cnt)
    {
        Console.WriteLine($"Sum : {Thread.CurrentThread.ManagedThreadId}");
        int s = 0;
        for (int i = 0; i <= cnt; i++)
            s += i;
        Console.WriteLine("Finish Sum");
        return s;
    }
    public static void Main()
    {
        Console.WriteLine($"Main : {Thread.CurrentThread.ManagedThreadId}");
        Task<int> t = Task.Run(() => Sum(1000));
        //TaskContinuationOptions.ExecuteSynchronously: 요 옵션을 두면 task를 실행했던 스레드에서 continue
        t.ContinueWith(Foo, TaskContinuationOptions.ExecuteSynchronously) ;

        t.ContinueWith(Goo, TaskContinuationOptions.ExecuteSynchronously);

        //t.ContinueWith((task) => Console.WriteLine("lambda"));

        Console.ReadLine();  
    }

    public static void Foo(Task<int> t)
    {
        Console.WriteLine($"Foo : {Thread.CurrentThread.ManagedThreadId}");
        Console.WriteLine($"Foo : {t.Result}");
    }
    public static void Goo(Task<int> t)
    {
        Console.WriteLine($"Goo : {Thread.CurrentThread.ManagedThreadId}");
        Console.WriteLine($"Goo : {t.Result}");
    }
}
```

```c#
using System;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    public static int Sum(int cnt)
    {
  
        return 100;
    }
    public static void Main()
    {
        Task<int> t = Task.Run(() => Sum(1000));

        t.ContinueWith(F1, TaskContinuationOptions.NotOnCanceled);
        t.ContinueWith(F2, TaskContinuationOptions.OnlyOnFaulted);
        t.ContinueWith(F3, TaskContinuationOptions.OnlyOnRanToCompletion);

        Console.ReadLine();
    }
    public static void F1(Task<int> t) { Console.WriteLine($"F1 : {t.Result}");  }
    public static void F2(Task<int> t) { Console.WriteLine($"F2 : {t.Result}");  }
    public static void F3(Task<int> t) { Console.WriteLine($"F3 : {t.Result}"); }
}
```



```c#
using System;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;

class Program
{
    public static int Sum(int cnt) 
    {
        return 100;
    }

    public static void Main()
    {
        Task<int> t = Task.Run(() => Sum(1000));

        t.ContinueWith( task => Console.WriteLine($"ContinueWith : {task.Result}")  );

        //대기 할수있는 객체
        TaskAwaiter<int> awaiter = t.GetAwaiter();
        
        //awaiter.OnCompleted(메소드) =>메소드는 인자없는 메소드
        awaiter.OnCompleted( () => Console.WriteLine($"awaiter : {awaiter.GetResult()}"));


        Console.ReadLine();
    }
}
```
---
<br>
<br>
<br>



# Async


비동기함수
- 비동기함수(메소드)
- Main(){Foo()}  =>Foo호출한후에 Foo가 다 실행된후 다음동작. 동기함수. (Synchronous Function)
- 비동기함수는 Foo함수에서 오랜시간이 소요되어 Foo 작업이 종료되었는지 보장할수없다. 작업종료를 확인하고 결과를 얻을수있어야한다. 
- C#에서는 비동기함수 두가지형태
	- 일반연산을 수행하는 비동기함수
	- 입출력(I/O)작업을 수행하는 비동기함수

```c#
using System;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    public static int Sum(int first, int last)
    {
        int s = 0;
        for (int i = first; i <= last; i++)
        {
            s += i;
            Thread.Sleep(10);
        }
        return s;
    }
    //Sum메소드를 비동기함수로 작성. 
    public static Task<int> SumAsync(int first, int last)
    {
        Task<int> t = Task.Run(() =>
        {
            int s = 0;
            for (int i = first; i <= last; i++)
            {
                s += i;
                Thread.Sleep(10);
            }
            return s;
        });
        return t;
    }

    public static void Main()
    {
        Task<int> ret = SumAsync(1, 200);

        Console.WriteLine("Main");
        Console.WriteLine($"{ret.Result}");


        //int ret = Sum(1, 200); // Blocking =>시간이 오래걸려서 Blocking.
        //Task<int> t = Task.Run(() => Sum(1, 200));
        
        //Console.WriteLine("Main");

        //Console.WriteLine($"{t.Result}");
    }

}
```
> Blocking 없이 Sum 메소드를 호출하려면
>- 방법1. 스레드를 생성해서 Sum 메소드 호출 
>	- Task.Run(()=>Sum(1,200));
>- 방법2. Sum메소드 자체를 비동기함수로 작성
>	- Sum메소드 안에서 스레드 생성.




## async/await

코드를 살펴보고 아래 설명을 보자. 

```c#
using System;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    public static Task<int> SumAsync(int first, int last)
    {
        return Task.Run(() =>
        {
            int s = 0;
            for (int i = first; i <= last; i++)
            {
                s += i;
                Thread.Sleep(10);
            }
            return s;
        });
    }

    public static void UpdateResult()
    {
        //비동기함수라서 blocking되지않음
        Task<int> t = SumAsync(1, 200);
        
        //결과값을 얻기위해서는 다시 Blocking
        //Console.WriteLine($"{t.Result}");

        //Blocking을 피하기위해 Awaiter가져오기
        var awaiter = t.GetAwaiter();

        awaiter.OnCompleted( () =>
            Console.WriteLine($"{awaiter.GetResult()}"));
   }



    public static void Main()
    {
        UpdateResult();

        Console.WriteLine("Main : Run Event Loop");
        Console.ReadLine();
    }
}
```

- 예를들어 어떤 프로그램을 만든다고 가정.
	- 사용자에게 2개의 숫자입력을 받음. 계산 버튼을 누르면, 입력받은 숫자(1,200)범위의 합을 구해서 출력해주는 GUI프로그램.
	- 단, 주스레드는 절대 Blocking되면 안된다. 
	- UpdateResult안에서 Blocking이 발생하면 
		- ->updateResult는 동기함수가 된다. 
	- UpdateResult 가 비동기 함수가 되려면
		- Task 연속기능을 사용한다.
		- t.ContinueWith()또는 t.GetAwaiter()
	- 비동기함수가 비동기함수를 호출. 비동기함수가 chain처럼 연결됨.
		- 요걸 async /await 키워드를 사용해서 좀 사용하기 쉽게만듬(마소)


Async/Await 키워드 사용 예제

```c#
using System;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    public static Task<int> SumAsync(int first, int last)
    {
        return Task.Run(() =>
        {
            int s = 0;
            for (int i = first; i <= last; i++)
            {
                s += i;
                Thread.Sleep(10);
            }
            return s;
        });
    }

 //밑에 함수와 정확히 동일하게 작동한다. 
    public static async void UpdateResult()
    {
        Console.WriteLine("UpdateResult");

        int ret = await SumAsync(1, 200); // 비동기 함수를 동기 함수 처럼 사용

        Console.WriteLine($"{ret}");
    }
/*
    public static void UpdateResult()
    {
        //비동기함수라서 blocking되지않음
        Task<int> t = SumAsync(1, 200);
        
        //결과값을 얻기위해서는 다시 Blocking
        //Console.WriteLine($"{t.Result}");

        var awaiter = t.GetAwaiter();

        awaiter.OnCompleted( () =>
            Console.WriteLine($"{awaiter.GetResult()}"));
   }
*/
    public static void Main()
    {
        UpdateResult();

        Console.WriteLine("Main : Run Event Loop");
        Console.ReadLine();
    }
}
```
>- public static async void UpdateResult()
>	- await 키워드를 만나면 함수는 즉시 반환된다.
>	- SumAsync 호출이 종료되면 풀에 있던 스레드가 나머지 부분을 실행한다.


```c#
using System;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    public static Task<int> SumAsync(int first, int last)
    {
        return Task.Run(() =>
        {
            int s = 0;
            for (int i = first; i <= last; i++)
            {
                s += i;
                Thread.Sleep(10);
            }
            return s;
        });
    }

    //public static async void UpdateResult()
    //public static async Task UpdateResult()
    public static async Task<int> UpdateResult()
    {
        int ret = await SumAsync(1, 200); 

        Console.WriteLine($"{ret}");
        return ret; //Task<int>일때는 return값 명시해줘야. Task 리턴일때는 return값 명시해주지않아도 자동으로 리턴된다. 
    }


    public static void Main()
    {
        Task<int> t = UpdateResult();

        //t.Wait(); 
        Console.WriteLine($"Main : {t.Result}");


        Console.WriteLine("Main : Run Event Loop");
        Console.ReadLine();
    }
}
```

- 정리
	- async/await 로 비동기함수 만들기
		- 반환타입앞에 async를 붙인다
		- 함수내에서 await를 사용하면 함수가 수행을 마치고 종료하게된다.
		- 반환타입은 void/Task/Task<T>로 할수있다. 



---
<br>
<br>
<br>


# Async IO

I/O 작업과 비동기함수
- FileStream fs =new FileStrea(...); fs.Write(...); 라는 코드가있을때
	1. fs.Write(..)
	2. WriteFile (Win32 API)
	3. OS와 File Device Driver (OS 영역)
	4. IO 제어칩->메모리->HDD (H/W영역) : 실제 쓰기 작업은 여기에서 이루어진다. 
- 3->4 에서 H/W적인 쓰기작업이 종료될때까지 대기해야한다. 대기하는 스레드가 하는일은없지만 TEB,STACK,TKO등의 오버헤드가있다. 
- 그렇다면 이렇게 대기하지말고-> 쓰기작업을 요청만 하고 함수가 바로 반환하면 어떨까?
    - fs.Write =>쓰기작업을 요청하고 완료될때까지 대기
	- fs.WriteAsync=>쓰기작업을 요청후 즉시 반환 . 쓰기작업 종료시 스레드풀에 통보 
- 비교
	- SumAsync() : 새로운 쓰레드에 의해 연산수행 =>계산 중심의 비동기함수
	- WriteAsync(): 비동기 입출력 작업 수행후 OS에 의해 통보 (새로운 스레드가 필요x. 통보할때만 스레드사용)=>입출력(I/O)중심의 비동기함수

```c#
using System;
using System.IO;

class Program
{
   
    public static void WriteSync()
    {
        using (FileStream fs = new FileStream("a.txt", FileMode.Create))
        {
            byte[] buff = new byte[1024 * 1024 * 1000]; // 1G

            fs.Write(buff); //  동기적으로 쓰기

            Console.WriteLine("WriteSync Finish");
        }
    }

    public static async void WriteAsync()
    {
        using (FileStream fs = new FileStream("a.txt", FileMode.Create))
        {
            byte[] buff = new byte[1024 * 1024 * 1000]; // 1G

            await fs.WriteAsync(buff);

            Console.WriteLine("WriteAsync Finish");
        }
    }


    public static void Main()
    {
        //WriteSync();
        WriteAsync();
        Console.WriteLine("Main");
        Console.ReadLine();
    }
}
```
