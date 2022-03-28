(() => {
  let yOffset = 0; // window.pageYoffset 값을 변수에 담아서
  let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 스크롤 섹션들의 스크롤 높이값의 합
  let currentScene = 0; // 현재 몇번째 스크롤 위치을 저장할 변수, 현재 활성화된(눈 앞에 보고 있는) 스크롤섹션
  let enterNewScene = false; //새로운 scene이 시작되는 순간 ture
  const sceneInfo = [
    /* 스크롤에 정보가 여기에  그리고 객체를 4개로 섹션이 4개이므로 1. 스크롤 높이*/
    {
      //스크롤섹션 0
      type: "sticky", //type은 normal 과 sticky 구분
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight을 셋팅
      scrollHeight: 0 /* 스크롤 높이 , 값을 0으로 하는 이유는 스크롤에 높이를 배수로*/,
      objs: {
        // 여기에 HTML 객체들을 모아둠
        container: document.querySelector("#scroll-section-0"), // 각 섹션 contaniner 0
        messageA: document.querySelector("#scroll-section-0 .main-message.a"),
        messageB: document.querySelector("#scroll-section-0 .main-message.b"),
        messageC: document.querySelector("#scroll-section-0 .main-message.c"),
        messageD: document.querySelector("#scroll-section-0 .main-message.d"),
      },
      values: {
        messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }], //css값을 정의해줌
        messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
        messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
        messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
        messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
      },
    },
    {
      //스크롤섹션 1
      type: "normal",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-1"), // 섹션 1
      },
    },
    {
      // 스크롤섹션 2
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-2"), //섹션 2
      },
    },
    {
      // 스크롤섹션 3
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-3"), //섹션 3
      },
    },
  ];

  function setLayout() {
    //섹션마다 스크롤 높이 함수
    for (let i = 0; i < sceneInfo.length; i++) {
      //sceneInfo을 다 돌면서 4군간에 스크롤높이를 셋팅
      if (sceneInfo[i].type === "sticky") {
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight; //윈도우에 브라우저 높이
      } else {
        sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
      }
      sceneInfo[
        i
      ].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }
    yOffset = window.pageYOffset;
    // console.log(sceneInfo);
    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight = totalScrollHeight + sceneInfo[i].scrollHeight;
      if (totalScrollHeight >= yOffset) {
        currentScene = i;
        break;
      }
    }
    document.body.setAttribute("id", `show-scene-${currentScene}`);
  }
  function calcValues(values, currentYOffset) {
    //values는 opacity 값[0,1]
    let rv;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight; // 현재 씬(스크롤섹션)에서 스크롤된 범위를 비유로 구하기
    if (values.length === 3) {
      // start ~ end 사이에 애니메이션 실행
      const partScrollStart = values[2].start * scrollHeight; // 시작점
      const partScrollEnd = values[2].end * scrollHeight; // 끝나는 지점
      const partScrollHeight = partScrollEnd - partScrollStart;

      if (
        currentYOffset >= partScrollStart &&
        currentYOffset <= partScrollEnd
      ) {
        rv =
          ((currentYOffset - partScrollStart) / partScrollHeight) *
            (values[1] - values[0]) +
          values[0];
      } else if (currentYOffset < partScrollStart) {
        rv = values[0];
      } else if (currentYOffset > partScrollEnd) {
        rv = values[1];
      }
    } else {
      rv = scrollRatio * (values[1] - values[0]) + values[0];
    }

    return rv; // return을 해줘야 값을 사용 가능
  }

  function playAnimation() {
    const values = sceneInfo[currentScene].values;
    const objs = sceneInfo[currentScene].objs;
    const currentYOffset = yOffset - prevScrollHeight;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;
    // console.log(currentScene, currentYOffset);
    switch (currentScene) {
      case 0:
        // let messageA_opacity_0 = sceneInfo[0].values.messageA_opacity[0];
        // let messageA_opacity_1 = sceneInfo[1].values.messageA_opacity[1]; // 이 두개를 변수처리 values, objs로
        // let messageA_opacity_0 = values.messageA_opacity[0];
        // let messageA_opacity_1 = values.messageA_opacity[1];
        // console.log(calcValues(values, currentYOffset));

        // console.log(messageA_opacity_0, messageA_opacity_1);
        const messageA_opacity_in = calcValues(
          values.messageA_opacity_in,
          currentYOffset
        );
        const messageA_opacity_out = calcValues(
          values.messageA_opacity_out,
          currentYOffset
        );

        const messageA_translateY_in = calcValues(
          values.messageA_translateY_in,
          currentYOffset
        );
        const messageA_translateY_out = calcValues(
          values.messageA_translateY_out,
          currentYOffset
        );

        if (scrollRatio <= 0.22) {
          //in
          objs.messageA.style.opacity = messageA_opacity_in;
          objs.messageA.style.transform = `translateY(${messageA_translateY_in}%)`;
        } else {
          //out
          objs.messageA.style.opacity = messageA_opacity_out;
          objs.messageA.style.transform = `translateY(${messageA_translateY_out}%)`;
        }

        break;

      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
    }
  }

  function scrollLoop() {
    // console.log(window.pageYOffset); // 현재 스크롤 위치
    // yOffset = window.pageYOffset; // 윈도우의 스크롤위치를 변수로 저장
    enterNewScene = false;
    prevScrollHeight = 0;
    // for (let i = 0; i < sceneInfo.length; i++) {
    //   prevScrollHeight += sceneInfo[i].scrollHeight;
    // }
    console.log(`모든 스크롤 사이즈 합: ${prevScrollHeight}`);
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight = prevScrollHeight + sceneInfo[i].scrollHeight;
    }

    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      enterNewScene = true;
      // console.log(sceneInfo[currentScene]);
      currentScene++;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
      // console.log(currentScene, prevScrollHeight);
      // console.log(`증가 섹션에 스크롤 사이즈 ${currentScene}`);
      // console.log(sceneInfo);
    }
    if (yOffset < prevScrollHeight) {
      enterNewScene = true;
      if (currentScene === 0) return; // 브라우저 바운스 효과를 인해 마이너스가 되는 것을 방지(모바일)
      currentScene--;
      document.body.setAttribute("id", `show-scene-${currentScene}`);

      // console.log(`감속 섹션에 스크롤 사이즈 ${currentScene}`);
    }

    if (enterNewScene) return;
    playAnimation(); // 섹션 0 스크롤 함수
  }

  window.addEventListener("resize", setLayout);
  window.addEventListener("scroll", () => {
    yOffset = window.pageYOffset;
    // console.log(`window scroll size ${yOffset}`);
    scrollLoop(); // 스크롤하면 실행되는 함수
  });
  window.addEventListener("load", setLayout); // 윈도우가 다 load되면 실행
  window.addEventListener("resize", setLayout); // 윈도우 사이즈가 변할때마다 사이즈가 변동
})();
