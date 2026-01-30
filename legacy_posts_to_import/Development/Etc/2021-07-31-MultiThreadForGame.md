---
title: "MultiThreading For Video Game"
date: 2021-07-31 19:35:00 +0900

  
excerpt: "비디오게임에서의 멀티쓰레드"

categories: 
- Development
- etc
tag: 
- Game
- MultiThread

---

게임엔진의 발전 덕분(?)인건지 요새 게임클라이언트 개발을 할때 멀티스레딩 프로그래밍을 신경쓸일은 거의 없는것같다. 
파일불러오고 쓰는 정도할때에나 잠깐 사용하는 정도인데, 뭐 심리스오픈월드게임을 만드는것도 아니니 이러한 상황이 정상인것같다.

나는 학원에서 급히 배워서 취업을 한케이스라 더 이쪽영역은 혼자 공부하지않고서는 미지의 영역으로 남아있었는데, 유튜브에서 감사하게도 포프님이
관련 내용으로 영상을 올려서 수박겉핥기식으로나마 어떤것인지 알수있었다. 
역사적으로 비디오게임영역에서의 멀티스레드 사용을 설명하고있었는데, 역시 경력많은 네임드 프로그래머답게 예전이야기로 풀어내니 내용도 이해가 쉽고
재밌다. 그래서 관련내용을 짧게나마 적어놓은걸 블로그에 정리겸 올려본다. 

포프님 관련 영상링크는 여기서 볼수있다: [MultiThreading For Video Game](https://youtu.be/M1e9nmmD3II)


# Early 90s
- single CPU
- Performance was not the main reason
- Non-blocking operation was
	- Through time slicing
	- Extra overhead on context switches
- e.g)Networking, file I/O

90년도 초에는 게임영역에서는 멀티스레드를 잘사용하지 않았다.사용한다고해도 네트워킹이나 파일IO 정도에만 사용하는 정도였다. 
이 당시에는 지금과 달리 '성능을 높이기 위한 멀티스레드'개념과는 좀 거리가 있다고할수있다. 멀티스레드 보다 메인스레드로 사용하는게 가장 빨랐기 때문이다.(어차피 그 당시 CPU의 코어가 하나였기때문에)
그렇기때문에 싱글스레드로만 사용시에 화면이 멈추는 문제(버튼을 누를경우 그 처리가 끝날때까지 block이되는등의 문제.이런상황에서는 사용자는 이게 프리징이된건지 진행중인지 알수없다)등을 해결하기위한 도구로서만 멀티스레드를 사용하였다.
즉,file IO나 networking정도에서만 멀티스레드를 사용해왔다. 하나의 코어 환경에서 멀티스레드를 사용할경우 스레드를 왔다갔다하는 문제때문에 결국 느릴수밖에없지만 사용자에게 Smooth한 User Experience를 제공하기위해 멀티스레드를 사용했다고 할수있다. 

# Why overhead?

왜 오버헤드가 생기나
- You have 1 worker
- Moving between 2 tables
- For every switch, he has to
	- Save his current work at table 1
	- Restore his other work at table 2
- For OS, this is
	- Saving/Loading registers & memory usage
	- Updating various tables and lists
	- Etc

그렇다면 멀티스레드 사용시 이러한 오버헤드는 왜 생기는가를 이야기해보면,실제 한명의 작업자가 두개의 테이블을 가지고 일을하고있었다고 가정하면 이해가 쉬워진다. 이러한 상황에는 작업자가 매번 테이블을 이동하면서 작업을 바꿀때마다 지금 하고있던일을 적어두고, 바뀐테이블에서 예전에 하던일을 다시 기억해야한다.이렇게 '뭐하고있었지?' 라고 기억하는것 os에서 context switch라고 한다. 이 과정에서 OS에서는 레지스터/메모리사용 세이브로드등을 한다고한다. 

# Gaming and Pert until mid-2000

- Gaming also used multi-threading for only non-blocking operations
	- Still rare or limited
	- Eg) audio, networking
- No multithreading for performance
	- Still single-core CPU
	- Exponential growth of speed thanks to Moore’s law
- “Free Lunch”

2000년대 중반까지도 게임은 멀티스레딩을 별로 안사용해옴. 사용해도 90년대와 비슷하게 Non-blocking operation에만 사용해왔다. 예를들어 음악이나 네트워킹정도만 사용하였다. 게임은 거의 싱글코어스레드만 사용. 멀티스레드는 안빨랐기때문에 굳이 사용할 이유가없었다.(게임이라는 프로그램자체가 다른 프로그램들에 비해 좀 특이한 영역이긴하다. CPU를 극한으로 사용하는 프로그램.)
게임개발자입장에서는 무어의법칙을 믿었기때문에 싱글스레드를 사용해서 CPU를 과하게 사용해도 몇년뒤면 CPU속도가 올라갔기때문에 무겁게 게임을 만들어놓아도 몇년뒤 쾌적하게 플레이되는 것을 추구했다. 

# Whart happened in mid-2000?
- we hit the limit
	- CPU stopped getting faster
	- Game was not getting faster
	- Free lunch is over😞
- 2-core CPU came out
- Still only 1 core is used with old architecture
- Time to multi-thread for perf

그러나 CPU속도가 빨라지는것에 한계에 도달했다. 발열때문에 트랜지스터의 수를 늘리는게 어려워진것이다.결국 CP제조사들은 트랜지스터대신 코어수를 늘리는 방식으로 변화하기 시작하였다. 이러한 상황에서는 퍼포먼스를 위해 할수있는 방법이 이제 멀티스레드밖에 없게된것이다. 


# Native but popular approach
- 2 main parts in game loop
	- Update and draw
	- Simular timing in “some” games
- Logical to give one thread for each
- Limitations
	- Not universal for all games
	- Data cop is needed to avoid race condition
- Not future proof

원시적인 방법이지만 가장 잘쓰인방법은 업데이트와 렌더를 분리하는것이었다. 기존 엔진구조에서 물리/애니메이션 처리등을 하고있는 업데이트와 렌더연산은 각각 연산량의 50%정도를 차지했고 이 둘을 나눠서 멀티스레드를 사용하는게 가장 단순하면서 합리적이었다.  즉, 메인스레드에서 업데이트를하고 렌더스레드에 이걸 복사해서 넘겨주고 렌더스레드에서 그려주는동안 다시 다음프레임 업데이트하는식으로 멀티스레딩을 사용하였는데, 이러한 변화로 20%정도의 성능향상이 있었다. 그러나 한계도 존재했다.게임애 따라서 업데이터와 렌더의 차지하는 시간이 비율이 상이하기도 하였으며,발표되는 Cpu에 따라 코어 갯수가다름. 듀얼코어일때는 이같은 방법이 괜찮았는데 코어가 3개가되면, 4개면 어떻게 나눌지에대한 고민도 시작된것이다.

# End of 2006
- intel i7 CPU
	- 4 core +hyper threading =8 cores
	- Only 25% usage max
	- What other 6 main parts take equal time?
- PS3 CPU
	- 1CPU
	- 7SPU
		- Not x86
		- Supports only special assembly-like language

2006년이 끝나갈무렵에는 위와같은 CPU들이 나오기 시작했고 옛날방식으로 2개만사용하게되면 cpu사용을 25%만 하는 게임들이 등장하기도하였다. 거기에 콘솔진영에서나온 Ps3는 아스트랄한 cpu 구조를 가지고있었는데,인텔하고 호환이 되는 cpu가아닌 괴랄스러운 아키텍쳐를 가지고있었고, 이때 나온 ps3게임이 xbox게임보다 구린 이유가 되기도하였다. 그러나 결국 나중엔 이러한 구조들을 이해하기시작했고, 게임업계에서도 많은 코어수를 사용하는 새로운 방식의 멀티스레드방식을 생각하기 시작하였다.

# Revisiting game loop 

- Thousands of game objects
- Similar operations on each
	- Physics update
	- Animation update(matrix math)
	- Frustum culling
	- Object rendering
	- And so on
- Task system!(aka job system)

새로운 멀티스레드 방식을 생각하기위해 게임을 다시 새롭게 보기시작했다. 그래서 나온 생각이 프로세스. 즉 액션기반으로 나누기보다는 데이터기반으로 스레드를 나눠보자라는 생각이었다. 게임안에는 오브젝트들이 굉장히 많은데이러한 수천개의 오브젝트들이 대부분 비슷한 작업을하고있다.( 물리체크/애니메이션/컬링/오브젝트렌더링등등) 즉,모든물체에적용되는 계산이 다 비슷하기때문에 물체를 스레드로 나눠서 넣어주는 방식을 생각하였다. 물체가 800개 코어가 8개라면 한코어당 100개씩넣어주는것이다. 이런것을 Job Queue/ job system,Task system라고 부르게되었다. 

<br>

![TaskSystem](../../assets/images/posts/tasksystem.png)
<br>


> 모든 코어의 피직스가 끝날때까지 멈춰있음. (먼저끝나는 코어도있음(5번째))/ 서로간 락을 걸지도 않음 <br>
> 모든 코어의 애니메이션=> 드로우 

이 같은 방식의 장점은 매우 간단하고 직관적이라는것이다.서로 다 다른 오브젝트이면서 서로를 변환시키지않기때문에 데이터 복사등 레이스. 락걸고 하는일이 없다.(멀티스레드 프로그래밍이 어려운이유중하나가 이러한것이라고 할수있는데 그걸 고려하지않아도 되는것이다.) 즉, 사람이 추적할수있는 방식으로 코어가 늘어나면 그 늘어난갯수만큼 오브젝트를 나눠주기만 하면 된다. 최근 유니티도 Job system(ECS)을 도입한것처럼 최근에도 사용하고있는 방법이다.

# Why is it better?

- No race condition
- Can adapt to any number of cores
- Minimum overhead
	- Each core get a list
	- An equal number of objects in each list
- More advanced topics
	- Job stealing 
	- Dependency graph


이같은 방식은 위 그림에서 보았듯이 코어 중 하나는 다 끝나서 작업을 기다리는경우가생긴다. 그렇기에 이러한 방식을 더 발전시키는 새로운 방식역시 나오고있다. 옆을 보니 100개의 작업이남아있늗데 나는 다끝났다고하면 그럼 그 작업분을 스틸해와서 작업하는 방식(job stealing)도 존재하며, 오브젝트끼리 참조를 걸어서 작업분에대한 순서를 정하는 경우도있다. (Depenency graph)

