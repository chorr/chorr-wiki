이 챕터에서 다루는 내용:
- HTML 문자들을 페이지에 넣기
- 엘리먼트 복제
- 엘리먼트 제거
- 엘리먼트 텍스트 조작

DOM을 순차적으로 처리하는데는 일반적인 과정의 JavaScript 코드가 필요하다. 주로 새로운 노드를 계속해서 document에 추가, 복제, 제거하는데 도움이 되는 코드들이 있겠다.

## 12.1 Injecting HTML

우선 효과적인 방법으로 HTML 문자열을 document 임의의 위치에 넣는걸 보자.

insertAdjacentHTML

Internet Explorer에 있는 API ([W3C HTML 5 스펙에 포함](http://www.w3.org/TR/html5/apis-in-html-documents.html#insertadjacenthtml))
하지만 몇 가지 문제가 있다.
- 오직 IE에만 존재 (따라서 대안책이 필요)
- IE의 구현은 매우 buggy 하다 (일부 엘리먼트에서만 동작)

때문에 처음부터 다시 깔끔한 API를 만들어야한다.
- 임의의, 유효한, HTML/XHTML 문자열을 DOM 구조체로 변환한다.
- 가능하면 효과적으로 DOM 구조체를 임의의 위치에 넣는다.
- 문자열의 inline script를 실행한다.


### 12.1.1 Converting HTML to DOM

딱히 마법과 같은게 아니라 우리가 익히 알고 있는 정밀한 도구: innerHTML 를 사용한다.
* HTML 문자열이 확실하게 HTML/XHTML에 대해 유효한지 확인한다. (최대한 valid 하도록 조작)
* 문자열엔 감싸여진 마크업이 필요하다.
* innerHTML 을 사용하여 dummy DOM 엘리먼트에 추가한다.
* DOM 노드를 다시 뽑아낸다.

"어때요? 참~ 쉽죠?"
종종 gotchas가 있을 수 있는데, 부드럽게 극복할 수 있다.

##### Pre-Process XML/HTML

문맥에 따라 달라지는 경우.
jQuery는 \<table/> 같은 XML 스타일 엘리먼트를 지원한다.
브라우저에서는 (IE 같은) 일부분의 HTML 엘리먼트만 XML 스타일만 동작한다.
pre-parse 통해 예방할 수 있겠다.

[Listing 12.1](http://jsbin.com/izisar)

    :::javascript
    // Listing 12.1 : http://jsbin.com/izisar
    var tags = /^(abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i;
    function convert(html){
      return html.replace(/(<(\w+)[^>]*?)\/>/g, function(all, front, tag){
        return tags.test(tag) ?
          all :
          front + "></" + tag + ">";
      });
    }
    assert( convert("<a/>") === "<a></a>", "Check anchor conversion." );
    assert( convert("<hr/>") === "<hr/>", "Check hr conversion." );


##### HTML Wrapping

대다수의 HTML 엘리먼트는 꼭 컨테이너 엘리먼트가 있어야한다. (예를 들어 option 태그)
두 가지 해결책을 보자.

* createElement, innerHTML으로 구성되기 전에 특정 parent에 문자열을 바로 넣을 수 있다. 허나 모든 환경에서 보장되지 않는다.
* 적합한 마크업으로 감싸져있을 땐 어느 컨테이너 엘리먼트에든 넣을 수 있다.

두번째 테크닉은 브라우저 특성에 따르는 방법.

    * option, optgroup : <select multiple="multiple">...</select>
    * legend : <fieldset>...</fieldset>
    * thead, tbody, tfoot, colgroup, caption : <table>...</table>
    * tr : <table><thead>...</thead></table> , <table><tbody>...</tbody></table> , <table><tfoot>...</tfoot></table>
    * td, th : <table><tbody><tr>...</tr></tbody></table>
    * col : <table><tbody></tbody><colgroup>...</colgroup></table>
    * link, script : <div>...</div>


* multiple select 를 사용한 이유는 inject 과정에서 자동으로 첫번째 option이 선택되는걸 방지하기 위해.
* col 태그를 위해 추가적인 tbody가 없으면 생성되지 않을 수 있다.
* link, script 경우 IE에서 앞뒤에 노드없이 innerHTML 사용하면 엘리먼트를 생성해내지 못한다.

##### Generating the DOM

[Listing 12.2](http://jsbin.com/ohevux)

    :::javascript
    // Listing 12.2 : http://jsbin.com/ohevux
    function getNodes(htmlString){
      var map = {
        "<td": [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        "<option": [1, "<select multiple='multiple'>", "</select>"]
        // a full list of all element fixes
      };

      var name = htmlString.match(/<\w+/),
        node = name ? map[ name[0] ] : [0, "", ""];

      var div = document.createElement("div");
      div.innerHTML = node[1] + htmlString + node[2];

      while ( node[0]-- )
        div = div.lastChild;

      return div.childNodes;
    }

    assert( getNodes("<td>test</td><td>test2</td>").length === 2,
      "Get two nodes back from the method." );
    assert( getNodes("<td>test</td>")[0].nodeName === "TD",
      "Verify that we're getting the right node." );

IE에서는 아래의 버그가 있다.
- 빈 table에 tbody를 추가해버린다.
- innerHTML으로 입력 된 문자열의 행간 공백을 모두 제거해버린다.

지금까지 과정을 거침으로써 이제 document에 추가할 준비가 되었다.

### 12.1.2 Inserting into the Document

* DOM Fragments
    * W3C DOM 스펙이며 모든 브라우저에서 지원
    * DOM 노드들을 담아 둘 수 있는 컨테이너를 제공
    * 장점1 : 간단한 명령으로 inject, clone 가능 - 명령어 수를 확 줄일 수 있다.
    * 장점2 : 반복하여 inject, clone 가능

jQuery 코드를 참조해보면, fragment가 재생성 되어 함수에 전달되는 걸 확인할 수 있다.

[Listing 12.3](http://jsbin.com/uyuwuz/2)

    :::javascript
    // Listing 12.3 : http://jsbin.com/uyuwuz/2
    // <div id="test"><b>Hello</b>, I'm a ninja!</div>
    // <div id="test2"></div>

    window.onload = function(){
      function insert(elems, args, callback){
        if ( elems.length ) {
          var doc = elems[0].ownerDocument || elems[0],
            fragment = doc.createDocumentFragment(),
            scripts = getNodes( args[0], doc, fragment ),
            first = fragment.firstChild;

          if ( first ) {
            for ( var i = 0; elems[i]; i++ ) {
              callback.call( root(elems[i], first),
                i > 0 ? fragment.cloneNode(true) : fragment );
            }
          }
        }
      }

      var divs = document.getElementsByTagName("div");

      insert(divs, ["<b>Name:</b>"], function(fragment){
        this.appendChild( fragment );
      });

      insert(divs, ["<span>First</span> <span>Last</span>"],
        function(fragment){
          this.parentNode.insertBefore( fragment, this );
        });
    };

마지막으로 사용자가 직접 table 넣기를 시도할 경우 tbody를 매핑하는 식으로 관리해준다.

[Listing 12.4](http://jsbin.com/uyuwuz/2)

    :::javascript
    // Listing 12.4 : http://jsbin.com/uyuwuz/2
    function root( elem, cur ) {
      return elem.nodeName.toLowerCase() === "table" &&
        cur.nodeName.toLowerCase() === "tr" ?
        (elem.getElementsByTagName("tbody")[0] ||
          elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
        elem;
    }

### 12.1.3 Script Execution

인라인 스크립트 엘리먼트가 document에 추가되면 실행이 되어야 할 것이다.
가장 좋은 방법은 document에 추가되기 전에 script 들을 분리시켜 놓는 방법이다.

[Listing 12.5](http://jsbin.com/atujam)

    :::javascript
    // Listing 12.5 : http://jsbin.com/atujam
    for ( var i = 0; ret[i]; i++ ) {
      if ( jQuery.nodeName( ret[i], "script" ) &&
          (!ret[i].type ||
            ret[i].type.toLowerCase() === "text/javascript") ) {
        scripts.push( ret[i].parentNode ?
          ret[i].parentNode.removeChild( ret[i] ) :
          ret[i] );
      } else if ( ret[i].nodeType === 1 ) {
        ret.splice.apply( ret, [i + 1, 0].concat(
          jQuery.makeArray(ret[i].getElementsByTagName("script"))) );
      }
    }

ret (생성 될 DOM 노드), scripts (스크립트들을 fragment로 모음)의 2가지 배열로 분리.
이제 교묘한 방법으로 스크립트들을 실행해보자.

##### Global Code Evaluation

사용자가 정의한 인라인 스크립트들은 global context로 실행 된다.
Andrea Giammarchi 가 착안한 스크립트 실행법을 이용한다. - document에 script 엘리먼트를 붙였다 때어내는 방식

[Listing 12.6](http://jsbin.com/orevuz)

    :::javascript
    // Listing 12.6 : http://jsbin.com/orevuz
    function globalEval( data ) {
      data = data.replace(/^\s+|\s+$/g, "");
    
      if ( data ) {
        var head = document.getElementsByTagName("head")[0] ||
            document.documentElement,
          script = document.createElement("script");
    
          script.type = "text/javascript";
          script.text = data;
    
          head.insertBefore( script, head.firstChild );
          head.removeChild( script );
      }
    }

"어때요? 참~ 쉽죠?"
이제 이를 활용하여 동적 로딩까지 되는 코드를 만들 수 있습니다.

[Listing 12.7](http://jsbin.com/uvinos)

    :::javascript
    // Listing 12.7 : http://jsbin.com/uvinos
    function evalScript( elem ) {
      if ( elem.src )
        jQuery.ajax({
          url: elem.src,
          async: false,
          dataType: "script"
        });
      else
        jQuery.globalEval( elem.text || "" );
    
      if ( elem.parentNode )
        elem.parentNode.removeChild( elem );
    }

Note : 실행이 완료 된 스크립트는 DOM에서 제거 합니다. (나중에 의도치 않는 이중 실행을 방지)



## 12.2 Cloning Elements

엘리먼트 복제(DOM cloneNode 메소드 사용)는 모든 브라우저에서 직접 사용 된다. 단, IE는 제외하고.
IE는 3가지 절망적인 단계를 거쳐야한다.

첫째, 엘리먼트 복제를 하면 이에 따른 모든 이벤트 헨들러를 복제한다.
jQuery에 구현 된 간단한 테스트를 보자.

[Listing 12.8](http://jsbin.com/atagec)

    :::javascript
    // Listing 12.8 : http://jsbin.com/atagec
    var div = document.createElement("div");
    
    if ( div.attachEvent && div.fireEvent ) {
      div.attachEvent("onclick", function(){
        // Cloning a node shouldn't copy over any
        // bound event handlers (IE does this)
        jQuery.support.noCloneEvent = false;
        div.detachEvent("onclick", arguments.callee);
      });
      div.cloneNode(true).fireEvent("onclick");
    }

둘째, 복제 된 엘리먼트에서 이벤트 헨들러를 제거하면 본래 엘리먼트쪽이 제거된다. (custom expando 속성도 마찬가지)

셋째, 이를 해결하는 단계는 또다른 엘리먼트에 넣은 다음, innerHTML으로 읽어오고, 그리고 다시 DOM 노드로 변환하는 것이다.
이 때 또다른 IE 버그 : innerHTML (또는 outerHTML) 읽어올 때 항상 정확한 엘리먼트 속성을 유지하지는 않는다. 때문에 XML DOM 확인 분기가 추가.

[Listing 12.9](http://jsbin.com/etegeh)

    :::javascript
    // Listing 12.9 : http://jsbin.com/etegeh
    function clone() {
      var ret = this.map(function(){
        if ( !jQuery.support.noCloneEvent && !jQuery.isXMLDoc(this) ) {
          var clone = this.cloneNode(true),
            container = document.createElement("div");
          container.appendChild(clone);
          return jQuery.clean([container.innerHTML])[0];
        } else
          return this.cloneNode(true);
      });
    
      var clone = ret.find("*").andSelf().each(function(){
        if ( this[ expando ] !== undefined )
          this[ expando ] = null;
      });
    
      return ret;
    }


## 12.3 Removing Elements

DOM에서 엘리먼트 제거하기는 간단하다. (removeChild 바로 사용)
제거하는 과정엔 주로 2단계가 필요하다.

- 연결되어 있는 이벤트 헨들러를 모두 정리해야 한다. 이 단계는 IE의 메모리릭 때문에 매우 중요하다.
- 연결되어 있는 외부 데이터를 정리해야 한다.

위 내용들은 추후 이벤트 챕터에서 다루기로 하자.

위의 포인트들이 엘리먼트 - 자손도 포함한 제거 과정에서 진행되는 jQuery 코드를 보자.

[Listing 12.10](http://jsbin.com/ivaguq)

    :::javascript
    // Listing 12.10 : http://jsbin.com/ivaguq
    function remove() {
      // Go through all descendants and the element to be removed
      jQuery( "*", this ).add([this]).each(function(){
        // Remove all bound events
        jQuery.event.remove(this);
    
        // Remove attached data
        jQuery.removeData(this);
      });
    
      // Remove the element (if it's in the DOM)
      if ( this.parentNode )
        this.parentNode.removeChild( this );
    }

또다른 고려사항은 정리 후에 실제로 DOM에서 엘리먼트가 없어졌는지 봐야한다. (역시 IE에서만 예외적)
잘 동작하는 해결책으로는 IE에서 제공하는 outerHTML 을 활용하는 방법.

[Listing 12.11](http://jsbin.com/uzuhuc)

    :::javascript
    // Listing 12.11 : http://jsbin.com/uzuhuc
    // Remove the element (if it's in the DOM)
    if ( this.parentNode )
      this.parentNode.removeChild( this );
    
    if ( typeof this.outerHTML !== "undefined" )
      this.outerHTML = "";

'''기억하세요! 항상 DOM을 tidy하게 유지해야 나중에 메모리 이슈를 덜어줍니다.'''


= 12.4 Text Contents =

* W3C-compliant 브라우저에서는 textContent 속성 사용 (자식, 자손 노드 모두 적용)
* IE에서는 innerText, textContent 속성 사용

[Listing 12.12](http://jsbin.com/olanub/2)

    :::javascript
    // Listing 12.12 : http://jsbin.com/olanub/2
    // <div id="test"><b>Hello</b>, I'm a ninja!</div>
    // <div id="test2"></div>
    
    window.onload = function(){
      var b = document.getElementById("test");
      var text = b.textContent || b.innerText;
    
      assert( text === "Hello, I'm a ninja!",
        "Examine the text contents of an element." );
      assert( b.childNodes.length === 2,
        "An element and a text node exist." );
    
      if ( typeof b.textContent !== "undefined" ) {
        b.textContent = "Some new text";
      } else {
        b.innerText = "Some new text";
      }
    
      text = b.textContent || b.innerText;
    
      assert( text === "Some new text", "Set a new text value." );
      assert( b.childNodes.length === 1,
        "Only one text nodes exists now." );
    };

Note : textContent/innerText 속성 사용 시 내부의 본래 엘리먼트 구조는 사라진다.

여기서 발생하는 gotchas
- 엘리먼트가 사라지는 경우 앞서 언급했던 메모리릭이 발생
- whitespace 크로스브라우징 처리 경우 최악

##### Setting Text

- 내부의 엘리먼트가 비워지고, 새로운 텍스트가 입력된다.
- 내부의 컨텐츠가 비워진다. - Listing 12.10

HTML과 텍스트 입력의 차이점 : HTML 고유 문자가 escape 된다.
때문에 createTextNode 메소드를 사용이 필요하다.

    :::javascript
    // Listing 12.13 : http://jsbin.com/otosuv/2
    // <div id="test"><b>Hello</b>, I'm a ninja!</div>
    // <div id="test2"></div>
    
    window.onload = function(){
      var b = document.getElementById("test");
    
      // Replace with your empty() method of choice
      while ( b.firstChild )
        b.removeChild( b.firstChild );
    
      // Inject the escaped text node
      b.appendChild( document.createTextNode( "Some new text" ) );
    
      var text = b.textContent || b.innerText;
    
      assert( text === "Some new text", "Set a new text value." );
      assert( b.childNodes.length === 1,
        "Only one text nodes exists now." );
    };


##### Getting Text

* endline 관련 문제들 때문에 textContent/innerText 사용은 하지 않는다. (해당 문제를 딱히 신경 쓸 필요 없다면 그냥 사용하는게 간단)
* 대신 텍스트 노드의 값들을 직접 읽어오는 것이 정확한 값을 가져오겠다.

[Listing 12.14](http://jsbin.com/olanof/2)

    :::javascript
    // Listing 12.14 : http://jsbin.com/olanof/2
    // <div id="test"><b>Hello</b>, I'm a ninja!</div>
    // <div id="test2"></div>

    window.onload = function(){
      function getText( elem ) {
        var text = "";

        for ( var i = 0, l = elem.childNodes.length; i < l; i++ ) {
          var cur = elem.childNodes[i];

          // A text node has a nodeType === 3
          if ( cur.nodeType === 3 )
            text += cur.nodeValue;

          // If it's an element we need to recurse further
          else if ( cur.nodeType === 1 )
            text += getText( cur );
        }

        return text;
      }

      var b = document.getElementById("test");
      var text = getText( b );

      assert( text === "Hello, I'm a ninja!",
        "Examine the text contents of an element." );
      assert( b.childNodes.length === 2,
        "An element and a text node exist." );
    };


## 12.5 Summary

* DOM 조작에 있어 어려운점과 이를 해결하는 방법을 포괄적으로 살펴 보았다.
* 크로스브라우징 이슈를 설명하고 실제로 구현하는게 훨씬 힘들다.
* 잘 동작하는 통합 된 솔루션을 만들기 위해 노력해야겠다.
