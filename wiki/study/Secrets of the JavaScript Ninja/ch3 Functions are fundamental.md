evernote에 막정리한 것 옮겨둠.

함수는 기본이다.

--

* 왜 함수는 매우 중요한지
* 어떻게 함수는 first-class 객체인지
* 함수 내부의 컨텍스트
* variable argument lists 다루는법
* 함수를 위한 검사방법

자바스크립트의 코드 품질 == 함수형 언어에 대한 인지

모든 함수 : first-class objects -> 모든 형태로 공존 가능

가장 중요한 특징 중 하나 : 익명 함수 -> 여러 장점을 가지게 된다

함수가 어떻게 정의되느냐? 이를 잘 이해해야 명확하고 간결하며 재사용 가능한 코드가 된다!!

--

3.1 함수 선언하기

Javascript에서는 함수를 선언하는 다양한 방법이 있다.

[Listing 3.1]

1. 함수명을 이용하여 선언 : named function (일반적으로 알고있는 방법)
2. 인라인의 익명 함수를 변수로 선언
3. 익명 함수를 window 객체의 속성으로 선언



3가지 정의는 전역 scope에서 본질적으로 동등 - 하지만 미묘한 차이가 있다.
순서를 바꿔보자

[Listing 3.2]



isNimble() 함수가 assert() 뒤에 선언되었음에도 문제가 없다.
함수명을 이용해 선언한 경우 scope 내에서 어디든 접근 가능

-- start ignore
http://jsbin.com/uyeneq/2
하지만!
변수명, 객체 속성에 익명 함수로 할당한 경우는 불가능 -> 우선 참조 되어야 한다.
canFly 변수 할당을 assert 뒤로 옮겨보면

-- end ignore

[Listing 3.3]

일반적인 실행 흐름 상 return 뒤에 선언 된 stealth() 까지 도달되지 않아보이지만..
이름지어진 함수는 특별 권한(specially privileged)

[Listing 3.4]


익명 함수는 앞에서 참조가 되지 않는다.

지금까지 본 개념은 네이밍, 흐름, 코드 내부 구조를 정하는 기초이며 매우 중요!

--

3.2 익명 함수

이 개념은 functional language (Scheme 같은) 으로 부터 차용 된 매우 중요하고 논리적 개념
일반적으로 나중에 사용 될 함수를 선언할 때 쓰인다. (변수나 객체 속성으로 저장되거나, 콜백 같은)

[Listing 3.5]

1. 객체 속성으로 함수 선언
2. 속성을 통해 함수 호출
3. 함수 인자로 함수를 선언 : setInterval() 함수의 인자로 익명 함수 선언을 했으며 매 1초마다 호출된다.



3.2.1 재귀

[Listing 3.6]

이 함수는 재귀를 위한 2가지 기준이 충족
1)자기 자신을 참조하며
2)종료조건으로 수렴 : n 인자는 줄어들며 0 보다 작아지면 재귀가 끝난다.
(조건2를 만족하지 않으면 무한 반복!)

named function 의 동작을 알아보았다. 그렇다면 익명 함수는?

[Listing 3.7]

객체 속성으로 익명 함수를 정의했으며, 재귀적으로 호출하기 위해 객체 속성을 참조하였다 : ninja.yell()
이 방법은 새로운 객체를 정의하기 전까지는 문제가 없다.
하지만 samurai 이름의 새 객체를 사용한다면?

[Listing 3.8]

2에서 ninja를 빈 객체로 정의하였고, 익명 함수는 여전히 존재 (samurai.yell 속성이 참조 중)
하지만 익명 함수 내부의 ninja.yell 속성은 더 이상 존재하지 않는다.

http://jsbin.com/ihuquv/3

위와 같이 함수 컨텍스트(this)를 수정하고, ninja 같이 명시적으로 익명 함수 참조하지 않는게 좋다.

다른 방식으로, 익명 함수에 이름을 부여하면 어떨까? 모순이 아닌가?

[Listing 3.9]

shout() 같이 인라인 함수에 이름이 부여할 수 있다는게 확인되었다.
겉으로 보기에 기괴할지 모르지만 다음과 같이 일반 변수에 할당도 가능하다.

[Listing 3.10]

인라인 함수의 매우 중요한 포인트!
*인라인 함수는 이름을 부여할 수 있다. 하지만, 이 이름은 그 함수 자체에서만 볼 수 있다.*
this를 사용하는 것보다 이 방법이 좀 더 명백한 접근을 보여준다.
또 다른 개념을 보자.

[Listing 3.11]

arguments.callee 속성은 함수를 호출한 대상(여기에선 자기 자신)을 알려준다.
이런 여러가지 기법을 통해서 익명 함수가 hard-coded 된 변수, 속성 이름 같은 깨지기 쉬운 의존성을 피해갈 수 있겠다.

--

3.3 객체로서의 함수

Javascript에서 함수는 속성, 객체의 prototype을 가질 수 있고, 변수나 속성으로 할당될 수 있다.
(plain vanilla object는 무슨뜻으로 쓰인?)
[예제코드]
객체를 변수에 할당할 수 있고, 함수도 마찬가지
NOTE : 위와 같이 마지막에 세미콜론으로 마무리하는게 좋은 습관
특히 변수에 할당 이후엔 더욱. 익명 함수도 예외는 아니다. 챕터???에서 다룰 코드압축에 도움이 된다.

다른 능력으로는 많은 사람이 놀랄법한 함수에 속성 부여!
[예제코드]
이런 함수의 모습은 라이브러리나 일반적인 on-page 코드를 통해 여러 방법으로 쓰일 수 있다.

--

3.3.1 함수 저장하기

이벤트 콜백 관리는 함수 저장의 매우 명확한 예제
모든 함수를 배열에 넣어두고 루프를 돌며 중복 함수를 찾아내는 방법이 있지만, 매우 비효율적

[Listing 3.12]

이 예제에서 만든 store 객체는 고유한 함수의 구성을 저장
1. 다음으로 설정 가능한 id 값
2. 함수를 캐시하여 저장하는 영역
3. cache를 통하여 함수를 추가하는 add() 함수 : 성공 여부를 return
Tip : !! 문법은 다른 Javascript 표현식을 Boolean으로 변환하는 간단한 방법



3.3.2 Self-memoizing 함수

메모이제이션은 이전의 결과값을 기억할 수 있게 함수를 만드는 과정
소수를 구하는 간단한 예제를 살펴보자.

[Listing 3.13]
1. 이미 캐시 된 값이 있다면 해당 값 return
2. 아니라면 계산 된 소수값을 저장

http://jsbin.com/arenaz/2
이와 같이 answers 속성 정의를 함수 초반에 해도 되겠다.

이런 방법의 장점 :
     이전의 계산 된 값을 활용함으로써 향상 된 퍼포먼스
     특별한 추가 동작 없이 원할하게 동작

단, 메모리를 희생하기 때문의 주의

[또 다른 예제코드]
함수 속성으로 캐시를 하여 코드가 간단해지고, 더 복잡한 쿼리 프로세스를 거치지 않는다.
 AverageMinMaxDeviationnon-cached version 12.5812130.50cached version1.73120.45단위 ms, 1000회 반복, Firefox 3 결과

*함수 속성의 유용성*
     한 공간에 캐시 정보를 저장/관리. 즉, 추가 공간이나 캐시 객체가 필요 없다.

--

3.4 Context

어마어마한 강점이자 어려운 내용
this : 모든 함수 안에 존재

--

3.4.1 함수 내부 Context

[Listing 3.14]

katana 객체 이름을 사용하여 직접적인 호출 없이 isSharp 속성에 접근
(만일 katana라는 객체 이름을 sword로 바꾼다면?)

--

3.4.2 독립적인 함수 내부 Context

독립적(top-level)으로 사용될 경우는 어떨까?

[Listing 3.15]

전역 객체(window)에서 선언 된 경우 this 역시 window context 참조
이런 context 표현은 여러 상황에서 함수를 다룰 때 완전 중요하다.

Note : ECMAScript 3.1 strict mode 에서는 객체 속성으로 함수 선언이 되지 않은 경우 더 이상 전역 객체 context를 가지지 않는다.

--

3.4.3 Context 정의

함수의 context를 고유 기능이라 생각하지만, 현실은 그렇지 않다.
함수가 어떻게 호출되느냐에 따라 결정 된다.
call(), apply()
모든 함수에 있으며, 함수 호출에 이용, context 정의, 전달 인자 구체화

[Listing 3.16]

call() 함수의 첫번째 인자로 간단하게 context를 정의할 수 있다.

call(), apply() 차이점 : 인자 전달 방법
[Listing 3.17]

call() : 각각 개별로 인자 전달
apply() : 배열형태로 인자 전달
이들의 실질적인 사용법을 간단한 예제로 알아보자.

--

3.4.4 반복문과 콜백

직진하듯 쭉 진행하는 함수 호출이 필요할 때, 직접 호출만으로 힘들다면, 콜백 함수를 이용
함수의 참조를 다른 함수로 전달 -> 다른 함수에선 이 참조를 이용해 콜백 호출
대부분 javascript 라이브러리의 반복문에서 활용

[Listing 3.18]

((코드 진행 설명))

기존의 for 반복문에 비해 유연함
콜백은 인스턴스 생성 없이 동작하며, this context로 언제든 원래 배열에 접근 가능
라이브러리에선 정말 중요한 요소
비동기적, 비결정적 행동 (버튼 클릭, Ajax 응답 반응, 배열에서 검색)

--

3.4.5 배열 메서드 속이기

배열과 유사한 객체를 생성했다면, 배열과 유사하게 동작하지만 실질적으로 배열의 추가 기능은 가지지 못한다.
해결책으로 새 객체를 생성할 때 마다 새로운 배열도 생성하고 따라서 필요한 속성과 메서드를 만든다.
하지만 매우 느림
일반 객체에 우리가 필요한 기능이 적용가능한지 실험해보자.

[Listing 3.19]

add() 함수에서 네이티브 객체 메서드(Array.prototype.push) 사용
보통 이 함수는 배열 context 연산에 사용되지만 여기선 call() 메서드를 사용해 객체 context를 넘겨 마치 배열인양 동작
length 속성도 증가됨!
이런 틀을 무너뜨리는 예시는 유순한 함수 context 위력을 보여준다.

--

3.5 Variable-length 인자 리스트

유연하여 강력한 함수 인자의 특징을 살펴보자.

--

3.5.1 배열에서 최소/최대 숫자

Javascript 언어에서 기본적으로 정의되어 있지 않기 때문에 직접 만들어보자.
반복문으로 배열을 탐색하는 방법이 있지만 다른 방법으로.
Math.min(), Math.max() 메서드는 인자 갯수 상관없이 처리 가능

[Listing 3.20]

apply() 호출할 때 context는 Math 객체로 지정. 상관없이 min(), max() 동작은 하지만 깔끔한 context 유지를 위해.

--

3.5.2 함수 오버로딩

앞의 3.2절에서 보았던 arguments 변수에 대해 자세히 살펴보자.

* Detecting and Traversing Arguments
하나의 root 객체에 다중 객체를 병합

[Listing 3.21]

가능한 하나의 전달받은 인자(root)는 이름으로 참조할 수 있도록.
추가로 전달 받는 인자는 arguments 변수를 통하여.
Tip : 전달된 인자가 있는지 확인하는 방법 : 인자이름 === undefined

* Slicing and Dicing an Arguments List
첫번째 인자와 나머지 인자 중 최대값을 곱하는 함수

[Listing 3.22]


뭔일이여?
arguments 변수는 실제 배열이 아니다.

[Listing 3.23]

앞서 봤던 배열 prototype 방식으로 해결

--

3.5.3 함수 오버로딩 (?? 같은제목)

겉으로 보기엔 같은 이름의 함수이지만 서로 다른 동작을 하는 형태에 대해 보자.

* The Function's Length Property
잘 알려지지 않았지만 모든 함수엔 length 속성이 있다.
http://jsbin.com/ubacul
     length : 함수 선언에서 명명 된 인자의 갯수
     arguments.length : 실제로 전달 받은 인자의 갯수

* Overloading Functions By Argument Count
몇개의 인자를 전달받느냐에 따라 서로 다르게 동작
if-then-else-if 명세

[Listing 3.24]

addMethod(myObject,'whatever',function(){ /* do something */ });

myObject.whatever 속성에 익명 함수를 적용

addMethod(myObject,'whatever',function(p1){ /* do something else */ });

이 때 같은 myObject.whatever()를 호출해도 서로 다른 익명 함수가 호출된다.

1. 이미 name 속성으로 선언된 내용이 있다면 old 변수에 저장된다. - 클로져
object.name() 함수가 실행 되었을때,
2. 최근에 전달 받았던 fn 인자의 갯수와 동일 하다면 바로 fn 익명 함수를 실행
3. 위의 인자 갯수와 다르다고, old에 저장 된 함수가 있다면 해당 함수를 실행

3부분이 매우 어려운듯

[Listing 3.25]

각 인자의 갯수마다 다르게 처리되는 모습을 볼 수 있다. (오버로딩처럼 보임)
제약사항 :
     오직 인자의 갯수에 따라 판단
     오버로딩 된 함수는 호출에 부하가 있다.

--

3.6 함수를 위한 검사

typeof 활용하여 함수 타입을 확인

- Firefox 2, 3 : HTML 객체 엘리먼트를 typeof로 확인하면 잘못 된 "function" 결과
- Firefox 2 : 정규식을 함수처럼 호출 가능. /test/("a test") 하지만 Firefox 2에서는 잘못 된 "function" 결과
- IE : iframe 같이 다른 윈도우 영역에서 타입을 찾으려하면 'unknown' 결과
- Safari : DOM Nodelist가 "function" 타입으로 인식: typeof document.body.childNodes == "function"

function isFunction(fn) {
  return Object.prototype.toString.call(fn) === "[object Function]";
}


--

3.7 Summary

Javascript에서 함수가 동작하는 다양한 방법을 보았다.
함수 내부 동작에 이해가 근본적으로 높은 품질의 코드를 생성
함수를 정의하는 여러 기술과 각각의 이점
익명 함수와 재귀에서 arguments.callee 사용으로 문제 해결
함수를 객체와 같이 사용하여 추가적인 데이터 저장의 이점
함수에서 context 동작과 apply, call 사용으로 스스로 조작하는 방법
여러 형태의 인자에 대해 처리할 수 있는 함수 (그리고 오버로딩)
마무리로 객체 타입과 함수 타입에 관한 크로스 브라우징 이슈
