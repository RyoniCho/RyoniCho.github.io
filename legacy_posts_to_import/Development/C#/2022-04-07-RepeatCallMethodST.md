---
title: "[C#] 특정시간마다 메소드를 호출하게 하는방법. 추가로 다음날 정오시간을 얻는 간단한방법."
date: 2022-04-07 22:29:00 +0900

excerpt: "How to call the function repeatly in specific time+How to Get Tomorrow Midnight Time"

categories: 
- Development
- csharp
tag: 
- C#
- CSharp
- Language
- DateTime
- Timer

---

# [C#] 특정시간마다 메소드를 호출하게 하는방법. 추가로 다음날 정오시간을 얻는 간단한방법. (How to call the function repeatly in specific time+How to Get Tomorrow Midnight Time)

파이썬에서는 Schedule이라는 모듈이있어서 특정시간에 메소드를 반복호출하는것을 구현하기가 간편했는데 C#에서는 이런 스케쥴링기능은 제공하지않아서 Timer를 활용하여 만들어줘야한다.

일단 Timer를 활용하면 일정 시간마다 반복적으로 메소드를 호출하는건 어렵지않다. 

```csharp
private void SetTimer()
{
		var timer = new Timer();
		timer.Interval = 60*1000;  //60 seconds
		timer.Elapsed += new ElapsedEventHandler(this.OnTimer);
		timer.Start();
}

public void OnTimer(object sender, ElapsedEventArgs args)
{
	   Console.WriteLine("60초마다 호출된다");
}
```

위의 코드를 보면 60초마다 OnTimer를 호출하는것을 알수있다. 그렇다면 매일 자정마다 이 함수를 호출해야한다면 어떻게 해야할까?  위 Timer 를 활용하면 이런식으로 구현할수있다. 

1. 특정시간과 현재시간의 차이를 구한다. 
2. 그 차이만큼의 시간을 인터벌로 넣는다.
3. 그럼 그 특정시간이 될경우 OnTimer함수가 불린다.
4. OnTimer에서는 하려던 처리를한후 마지막에 인터벌을 24시간으로 설정한다. 

간단하게 이해하면 특정시간까지를 인터벌로 설정해서 실행되면 인터벌을 24시간으로 바꿔주는 방식이다. 이렇게되면 이 프로그램이 언제시작되는지와 별개로 특정시간에 특정함수를 반복호출하게 할수있다. 

나는 매 정오마다 함수를 호출하게 하고싶었는데, 다음날 00:00를 구하는 방법을 찾는것도 좀 애매하긴했다. 이건 회사분이 찾아주셨는데 간단하게 구현할수있었다. 다음날 00:00를 c#에서 구현하는 방법은 다음과 같다. 

```csharp
DateTime tomorrowMidNight = DateTime.Today.AddDays(1);
```

DateTime에는 Today라는 것이 존재했는데 이걸가져오면 해당날짜의 00:00시간을 가져온다. 따라서 여기에서 하루만 더해주면 다음날 정오가된다.

**이를 모두 정리하여 매 00:00 마다 특정 메소드를 호출하는 방법은 이러하다.** 

```csharp
private Timer timer;
private void SetTimer()
{
		DateTime tomorrowMidNight = DateTime.Today.AddDays(1);
    TimeSpan remainTimeSpanToMidnight = tomorrowMidNight - DateTime.Now;

		timer = new Timer();
		timer.Interval = remainTimeSpanToMidnight.TotalMilliseconds;
		timer.Elapsed += new ElapsedEventHandler(this.OnTimer);
		timer.Start();
}

public void OnTimer(object sender, ElapsedEventArgs args)
{
	  Console.WriteLine("매일 00:00 마다 호출된다.");
		
		//24시간마다 호출되는걸로 인터벌을 바꿔준다.
		timer.Interval = (24 * 60 * 60 * 1000); //24hours(24 * 60 * 60 * 1000)
}
```