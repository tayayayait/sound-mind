<?xml version="1.0" encoding="UTF-8"?>
<uiuxSpec
  productName="Sound Mind"
  locale="ko-KR"
  documentVersion="1"
  themeMode="light-only"
  toneName="calm-nature"
  createdDate="2026-02-04"
  sourceMarkdown="상세서.md"
>
  <documentMeta>
    <title>Sound Mind(가칭) UX/UI 상세서 v1 (Light Only)</title>
    <createdDate>2026-02-04</createdDate>
    <audience>
      <role>PO</role>
      <role>디자이너</role>
      <role>iOS 개발</role>
      <role>Android 개발</role>
      <role>Web 개발</role>
    </audience>
    <platforms>
      <platform type="mobileApp">
        <os>iOS</os>
        <os>Android</os>
      </platform>
      <platform type="web">
        <formFactor>PC</formFactor>
        <formFactor>Mobile</formFactor>
      </platform>
    </platforms>
    <theme>
      <mode>light-only</mode>
      <note>Light Only(1차 고정)</note>
    </theme>
    <tone>
      <name>Calm Nature</name>
      <description>따뜻한 뉴트럴 배경 + 세이지/티얼 포인트, 비판단적·안정적 커뮤니케이션</description>
    </tone>
  </documentMeta>
  <purposeAndScope code="0">
    <title>목적 &amp; 적용 범위</title>
    <list ordered="false">
      <item>목표: “음성 녹음 → 분석 → 이해 가능한 시각화 → 즉시 실행(명상/가이드)”까지 사용자가 불안 없이 따라갈 수 있는 UX/UI 기준을 문서화합니다.</item>
      <item>본 문서는 규칙/규격 중심 문서이며, 화면·컴포넌트·토큰·상태를 개발/디자인이 그대로 참고해 구현할 수 있도록 작성합니다.</item>
      <item>기술 스택이 확정되지 않았으므로 규격은 플랫폼-중립(px/dp) 기준으로 정의합니다.</item>
      <item>다크모드: 본 버전은 Light Only로 고정합니다(다크는 토큰 확장으로 2차).</item>
    </list>
  </purposeAndScope>
  <uxPrinciples code="1">
    <title>제품 경험 목표(UX Principles)</title>
    <principle index="1">
      <title>안심(Trust &amp; Safety)</title>
      <description>의료적 진단이 아닌 “상태 참고”임을 명확히 하고, 데이터/프라이버시를 UI에서 반복 확인합니다.</description>
    </principle>
    <principle index="2">
      <title>인지부하 최소(Clarity)</title>
      <description>녹음/분석/결과의 핵심 CTA는 화면당 1개를 기본으로 고정하고, 보조 정보는 접기/카드로 정리합니다.</description>
    </principle>
    <principle index="3">
      <title>비판단적 언어(Non-judgmental copy)</title>
      <description>“좋음/나쁨” 대신 “경향/변화/추천” 중심으로 표현합니다.</description>
    </principle>
    <principle index="4">
      <title>루틴화(Routine)</title>
      <description>오늘의 상태 → 짧은 행동(명상 3~10분)으로 자연스럽게 이어지는 플로우를 제공합니다.</description>
    </principle>
    <principle index="5">
      <title>연속성(Continuity)</title>
      <description>단발 점수보다 “추세”를 기본으로 하며, 비교는 “어제/지난주 평균”처럼 부드럽게 제공합니다.</description>
    </principle>
  </uxPrinciples>
  <informationArchitecture code="2">
    <title>정보구조(IA) &amp; 네비게이션</title>

    <navigation code="2.1">
      <mobileTabs>
        <tab>홈</tab>
        <tab>녹음</tab>
        <tab>치유</tab>
        <tab>보관함</tab>
      </mobileTabs>
      <webNav>
        <description>상단 네비(동일 메뉴) + 우측 프로필/설정</description>
      </webNav>
    </navigation>

    <screenMap code="2.2">
      <mapItem id="onboarding" areaLabel="온보딩">
        <steps>
          <step>환영</step>
          <step>약관/개인정보 동의</step>
          <step>마이크 권한</step>
          <step optional="true">첫 녹음 가이드</step>
        </steps>
        <raw>온보딩: 환영 → 약관/개인정보 동의 → 마이크 권한 → (선택) 첫 녹음 가이드</raw>
      </mapItem>

      <mapItem id="homeDashboard" areaLabel="홈/대시보드">
        <features>
          <feature>요약</feature>
          <feature>추세</feature>
          <feature>추천 행동(명상/가이드)</feature>
          <feature>최근 기록</feature>
        </features>
        <raw>홈/대시보드: 요약 + 추세 + 추천 행동(명상/가이드) + 최근 기록</raw>
      </mapItem>

      <mapItem id="recording" areaLabel="녹음">
        <states>
          <state>준비</state>
          <state>녹음 중</state>
          <state>일시정지</state>
          <state>분석 중</state>
          <state>실패</state>
        </states>
        <raw>녹음: 준비 / 녹음 중 / 일시정지 / 분석 중 / 실패</raw>
      </mapItem>

      <mapItem id="analysisResult" areaLabel="분석 결과">
        <features>
          <feature>요약</feature>
          <feature>지표 상세</feature>
          <feature>텍스트 조언</feature>
          <feature>추천 콘텐츠</feature>
          <feature>기록/공유</feature>
        </features>
        <raw>분석 결과: 요약 + 지표 상세 + 텍스트 조언 + 추천 콘텐츠 + 기록/공유</raw>
      </mapItem>

      <mapItem id="healingContent" areaLabel="치유 콘텐츠">
        <sections>
          <section>리스트</section>
          <section>상세</section>
          <section>플레이어</section>
        </sections>
        <raw>치유 콘텐츠: 리스트 / 상세 / 플레이어</raw>
      </mapItem>

      <mapItem id="library" areaLabel="보관함">
        <sections>
          <section>녹음 파일 리스트</section>
          <section>상세</section>
          <section>삭제/공유</section>
        </sections>
        <raw>보관함: 녹음 파일 리스트 / 상세 / 삭제/공유</raw>
      </mapItem>

      <mapItem id="settings" areaLabel="설정">
        <sections>
          <section>계정</section>
          <section>알림</section>
          <section>개인정보·데이터(내보내기/삭제)</section>
          <section>도움말</section>
          <section>긴급 안내</section>
        </sections>
        <raw>설정: 계정 / 알림 / 개인정보·데이터(내보내기/삭제) / 도움말 / 긴급 안내</raw>
      </mapItem>
    </screenMap>
  </informationArchitecture>
  <toneAndManner code="3">
    <title>톤앤매너(Visual + Copy)</title>

    <visualKeywords>
      <item>따뜻한 종이 질감의 뉴트럴(오프화이트) + 자연계열 포인트(티얼/세이지)</item>
      <item>라운드 코너(12~16) + 얕은 그림자(과한 글로시 금지)</item>
      <item>차트는 “선명하지만 부드럽게”: 진한 원색 남발 금지, 1~2개 포인트 컬러만 강조</item>
    </visualKeywords>

    <copyGuidelines>
      <forbidden>
        <item>“정상/비정상”, “위험”, “문제” (의학적 단정/공포 유발)</item>
      </forbidden>
      <recommended>
        <item>“오늘은 긴장 경향이 조금 높게 나타났어요.”</item>
        <item>“최근 7일 평균 대비 +8”</item>
      </recommended>
      <ctaExamples>
        <item>지금 3분 호흡하기</item>
        <item>짧게 안정 찾기</item>
        <item>내 기록 보기</item>
      </ctaExamples>
      <fixedNotice>본 결과는 참고용이며 의학적 진단이 아닙니다. 심각한 불안/위기 상황에서는 전문가 도움을 받아주세요.</fixedNotice>
    </copyGuidelines>
  </toneAndManner>
  <designSystem code="4">
    <title>디자인 시스템(Foundations)</title>
    <baseRules code="4.1">
      <baseUnit value="4" unit="pt">
        <note>space는 4의 배수</note>
      </baseUnit>
      <touchTargetMin value="44" unit="px">
        <note>모바일 기준</note>
      </touchTargetMin>
      <mobileBodyFontMin value="16" unit="px">
        <note>모바일 기준</note>
      </mobileBodyFontMin>
    </baseRules>
    <colors code="4.1.1" theme="light-only">
      <palettes>
        <palette id="baseNeutrals">
          <token name="color.neutral.0" value="#FFFFFF"><usage>Surface(카드/모달 배경)</usage></token>
          <token name="color.neutral.5" value="#F7F5F2"><usage>Canvas(앱 전체 배경)</usage></token>
          <token name="color.neutral.10" value="#F1EEE9"><usage>Subtle bg(섹션 배경)</usage></token>
          <token name="color.neutral.20" value="#E5E1DA"><usage>Border/Divider</usage></token>
          <token name="color.neutral.60" value="#6B726F"><usage>Muted text</usage></token>
          <token name="color.neutral.80" value="#2A3230"><usage>Heading text</usage></token>
          <token name="color.neutral.90" value="#1A1F1E"><usage>Primary text</usage></token>
        </palette>

        <palette id="brandSageTeal">
          <token name="color.brand.50" value="#E6F5F1"><usage>배경 tint, 칩/배지</usage></token>
          <token name="color.brand.100" value="#CDEBE3"><usage>hover/pressed 배경(연함)</usage></token>
          <token name="color.brand.300" value="#6FC4AE"><usage>그래프 보조, 포커스 링</usage></token>
          <token name="color.brand.500" value="#2A9D8F"><usage>강조(링/라인/아이콘)</usage></token>
          <token name="color.brand.600" value="#1C7C6B"><usage>Primary 버튼, 핵심 CTA</usage></token>
          <token name="color.brand.700" value="#145B4F"><usage>pressed/active 진한 상태</usage></token>
        </palette>

        <palette id="accentWarmSand">
          <token name="color.accent.50" value="#FFF6E3"><usage>배경 tint</usage></token>
          <token name="color.accent.300" value="#F4C86A"><usage>작은 하이라이트/배지</usage></token>
        </palette>

        <palette id="feedback">
          <token name="color.success.50" value="#E8F5EE"><usage>성공 배경</usage></token>
          <token name="color.success.600" value="#1F7A53"><usage>성공 텍스트/아이콘</usage></token>
          <token name="color.warning.50" value="#FFF4E5"><usage>경고 배경</usage></token>
          <token name="color.warning.600" value="#B86B00"><usage>경고 텍스트/아이콘</usage></token>
          <token name="color.danger.50" value="#FEE4E2"><usage>오류 배경</usage></token>
          <token name="color.danger.600" value="#B42318"><usage>오류 텍스트/아이콘</usage></token>
        </palette>
      </palettes>

      <semanticTokens>
        <semanticToken name="bg.canvas" ref="color.neutral.5" />
        <semanticToken name="bg.surface" ref="color.neutral.0" />
        <semanticToken name="bg.subtle" ref="color.neutral.10" />
        <semanticToken name="text.primary" ref="color.neutral.90" />
        <semanticToken name="text.secondary" ref="color.neutral.60" />
        <semanticToken name="text.heading" ref="color.neutral.80" />
        <semanticToken name="border.default" ref="color.neutral.20" />
        <semanticToken name="action.primary.bg" ref="color.brand.600" />
        <semanticToken name="action.primary.fg" ref="color.neutral.0" />
        <semanticToken name="focus.ring" ref="color.brand.300" />
      </semanticTokens>

      <contrastRules>
        <rule>본문 텍스트: 최소 4.5:1 (text.primary vs bg.canvas/surface)</rule>
        <rule>비활성/보조 텍스트: 의미 전달 요소(라벨/값)는 4.5:1 유지, 힌트/placeholder만 완화 가능(단, 접근성 옵션/확대 고려)</rule>
      </contrastRules>
    </colors>
    <typography code="4.1.2">
      <fontFamily primary="Pretendard" fallback1="Noto Sans KR" fallback2="system" />
      <numberFormatting>
        <tabularNumbers enabled="true" note="가능 시" />
      </numberFormatting>
      <textTokens>
        <textToken name="text.display" fontSize="32" lineHeight="40" fontWeight="700">
          <usage>결과 점수(큰 숫자), 핵심 타이틀</usage>
        </textToken>
        <textToken name="text.h1" fontSize="24" lineHeight="32" fontWeight="700">
          <usage>화면 타이틀</usage>
        </textToken>
        <textToken name="text.h2" fontSize="20" lineHeight="28" fontWeight="600">
          <usage>섹션 타이틀</usage>
        </textToken>
        <textToken name="text.h3" fontSize="18" lineHeight="26" fontWeight="600">
          <usage>카드 타이틀</usage>
        </textToken>
        <textToken name="text.body" fontSize="16" lineHeight="24" fontWeight="400">
          <usage>본문 기본</usage>
        </textToken>
        <textToken name="text.bodyStrong" fontSize="16" lineHeight="24" fontWeight="600">
          <usage>본문 강조</usage>
        </textToken>
        <textToken name="text.caption" fontSize="12" lineHeight="16" fontWeight="400">
          <usage>보조 설명/라벨</usage>
        </textToken>
      </textTokens>
      <rules>
        <rule>모바일 본문 최소 16px, 줄간 1.5 권장(24px)</rule>
        <rule>긴 문장은 카드 안에서 최대 3~5줄 기본, “더보기” 제공</rule>
      </rules>
    </typography>
    <layoutTokens code="4.1.3">
      <spacingScale unit="px">
        <space step="0" value="0" />
        <space step="1" value="4" />
        <space step="2" value="8" />
        <space step="3" value="12" />
        <space step="4" value="16" />
        <space step="5" value="20" />
        <space step="6" value="24" />
        <space step="8" value="32" />
        <space step="10" value="40" />
        <space step="12" value="48" />
        <space step="16" value="64" />
      </spacingScale>

      <radiusTokens unit="px">
        <radiusToken name="radius.sm" value="8"><usage>칩/작은 입력</usage></radiusToken>
        <radiusToken name="radius.md" value="12"><usage>버튼/입력 기본</usage></radiusToken>
        <radiusToken name="radius.lg" value="16"><usage>카드/모달</usage></radiusToken>
        <radiusToken name="radius.pill" value="999"><usage>토글/배지</usage></radiusToken>
      </radiusTokens>

      <elevationTokens>
        <elevationToken name="elevation.1">
          <value>0 1px 2px rgba(26,31,30,.06)</value>
          <usage>기본 카드</usage>
        </elevationToken>
        <elevationToken name="elevation.2">
          <value>0 6px 18px rgba(26,31,30,.10)</value>
          <usage>모달/떠있는 요소</usage>
        </elevationToken>
      </elevationTokens>

      <zIndexScale>
        <z name="z.base" value="0" />
        <z name="z.header" value="10" />
        <z name="z.sheet" value="30" />
        <z name="z.modal" value="40" />
        <z name="z.toast" value="50" />
      </zIndexScale>
    </layoutTokens>
    <motionGuidelines code="4.1.4">
      <durations>
        <microInteractions minMs="150" maxMs="200" />
        <screenTransitions minMs="220" maxMs="280" />
      </durations>
      <easing value="cubic-bezier(0.2, 0, 0, 1)" />
      <recordButton>
        <press scale="0.96" durationMs="150" />
        <release scale="1.0" />
      </recordButton>
      <processingLoading>
        <rule>회전/점 3개 등 저자극 애니메이션(과한 바운스 금지)</rule>
      </processingLoading>
    </motionGuidelines>
    <layoutSystem code="4.2">
      <mobile code="4.2.1">
        <screenPaddingX value="16" unit="px" />
        <sectionGap value="24" unit="px" />
        <cardPadding value="16" unit="px" />
        <appBarHeight value="56" unit="dp" />
        <tabBarHeight value="64" unit="dp">
          <note>+ safe area</note>
        </tabBarHeight>
      </mobile>
      <web code="4.2.2">
        <container maxWidth="1200" unit="px" />
        <horizontalPadding unit="px" breakpointInclusiveMin="1024">
          <valueWhenGE1024>24</valueWhenGE1024>
          <valueWhenLT1024>16</valueWhenLT1024>
        </horizontalPadding>
        <grid columns="12" gutter="24" unit="px" />
        <cardGrid columnsMin="2" columnsMax="4" />
        <breakpoints unit="px">
          <breakpoint name="xs" value="360" />
          <breakpoint name="sm" value="480" />
          <breakpoint name="md" value="768" />
          <breakpoint name="lg" value="1024" />
          <breakpoint name="xl" value="1280" />
          <breakpoint name="2xl" value="1440" />
        </breakpoints>
      </web>
    </layoutSystem>
    <iconography code="4.3">
      <rules>
        <rule>아이콘 스타일: 라인(Outline) 기반, 모서리 라운딩, 시각적 무게 균일(혼합 금지)</rule>
        <rule>아이콘 규격: 16(보조), 20(인라인), 24(기본), 32(강조) — 클릭/탭 영역은 44×44 이상</rule>
        <rule>선 두께(권장): 1.5~2.0px(웹 기준) / 플랫폼 기본 아이콘 두께에 맞춰 통일</rule>
        <rule>아이콘 색상: 기본 text.secondary, 강조 color.brand.600, 위험/경고만 color.danger.600/color.warning.600</rule>
        <rule>그래픽(일러스트/배경): 고채도·자극적 대비 금지, 저채도 그라데이션/추상 형태 권장(명상·안정 맥락 유지)</rule>
      </rules>
      <sizes>
        <size value="16" usage="보조" />
        <size value="20" usage="인라인" />
        <size value="24" usage="기본" />
        <size value="32" usage="강조" />
      </sizes>
      <strokeWidth recommendedMin="1.5" recommendedMax="2.0" unit="px">
        <note>웹 기준, 플랫폼 기본 두께와 통일</note>
      </strokeWidth>
      <colorUsage>
        <default ref="text.secondary" />
        <emphasis ref="color.brand.600" />
        <danger ref="color.danger.600" />
        <warning ref="color.warning.600" />
      </colorUsage>
    </iconography>
  </designSystem>
  <componentsSpec code="5">
    <title>컴포넌트 규격(Components Spec)</title>
    <components>
      <component id="button" code="5.1" name="Button">
        <spec>
          <variants>
            <variant id="primary">
              <description>Primary: bg action.primary.bg, fg action.primary.fg</description>
              <bgToken>action.primary.bg</bgToken>
              <fgToken>action.primary.fg</fgToken>
            </variant>
            <variant id="secondary">
              <description>Secondary: bg bg.surface, border border.default, fg text.primary</description>
              <bgToken>bg.surface</bgToken>
              <borderToken>border.default</borderToken>
              <fgToken>text.primary</fgToken>
            </variant>
            <variant id="ghost">
              <description>Ghost: bg transparent, fg color.brand.600</description>
              <bgValue>transparent</bgValue>
              <fgToken>color.brand.600</fgToken>
            </variant>
            <variant id="destructive">
              <description>Destructive: fg/bg는 color.danger.* 사용(필요 화면에만)</description>
            </variant>
          </variants>
          <sizes>
            <size id="L" height="48" paddingX="16" radius="12" fontToken="text.bodyStrong" />
            <size id="M" height="44" paddingX="14" radius="12" fontToken="text.bodyStrong" />
            <size id="S" height="36" paddingX="12" radius="999/12" fontToken="text.caption">
              <note>caption 12~14</note>
            </size>
          </sizes>
          <states>
            <state id="disabled">opacity 0.45 + interaction off</state>
            <state id="loading">스피너(16) + 텍스트 유지(레이아웃 점프 금지)</state>
            <state id="webHover">배경 4~6% 어둡게 or border 강조(스케일 변화 금지)</state>
          </states>
        </spec>
        <raw>Variants: Primary/Secondary/Ghost/Destructive. Sizes: L(48), M(44), S(36). States: Disabled/Loading/Web hover.</raw>
      </component>
      <component id="input" code="5.2" name="Input">
        <spec>
          <base height="48" radius="12">
            <border width="1" token="border.default" />
          </base>
          <label textToken="text.caption" gapPx="8" />
          <helper textToken="text.caption" gapPxMin="6" gapPxMax="8" />
          <states>
            <state id="focus">
              <borderToken>color.brand.500</borderToken>
              <focusRing width="2" token="focus.ring" opacity="0.4" />
            </state>
            <state id="error">
              <borderToken>color.danger.600</borderToken>
              <helperToken>color.danger.600</helperToken>
            </state>
            <state id="disabled">
              <bgToken>color.neutral.10</bgToken>
              <textToken>color.neutral.60</textToken>
            </state>
          </states>
        </spec>
        <raw>Height 48, Radius 12, Border 1px(border.default). Focus: brand.500 + focus ring(2px, 40%). Error: danger.600. Disabled: neutral.10/neutral.60.</raw>
      </component>
      <component id="card" code="5.3" name="Card">
        <spec>
          <base bgToken="bg.surface" borderToken="border.default" radius="16" padding="16" elevation="elevation.1" />
          <spacing headerBodyGap="12" betweenCardsMin="12" betweenCardsMax="16" />
          <cardTypes>
            <type id="summaryCard" name="SummaryCard">
              <description>대시보드 요약: 점수 + 추세 + CTA</description>
            </type>
            <type id="metricCard" name="MetricCard">
              <description>지표명/값/변화(↑↓) + 작은 스파크라인</description>
            </type>
            <type id="adviceCard" name="AdviceCard">
              <description>텍스트 조언 + “짧은 행동” 버튼</description>
            </type>
            <type id="contentCard" name="ContentCard">
              <description>명상 콘텐츠(썸네일/타이틀/시간)</description>
            </type>
          </cardTypes>
        </spec>
        <raw>기본: surface + border.default + radius16 + padding16 + elevation1. 카드 헤더-본문 12. 카드 간 12~16. 타입: Summary/Metric/Advice/Content.</raw>
      </component>
      <component id="modal" code="5.4" name="ModalAndBottomSheet">
        <spec>
          <alertModal>
            <width mobile="320" webMin="400" webMax="480" />
            <padding value="20" />
            <radius value="16" />
            <overlay color="#000000" opacity="0.4" />
            <buttons>
              <rule>Primary 1개 + Secondary(텍스트) 또는 2버튼(동등 폭)</rule>
            </buttons>
          </alertModal>
          <bottomSheet>
            <handle width="32" height="4" radius="999" />
            <topRadius value="20" />
            <maxHeight value="90vh" />
            <scrollable enabled="true" />
            <closeMethods>
              <method>아래로 스와이프</method>
              <method>X 버튼(접근성)</method>
            </closeMethods>
          </bottomSheet>
        </spec>
        <raw>Alert modal(모바일 320, 웹 400~480, padding20, radius16, overlay black40%). Bottom sheet(handle 32x4, top radius20, max-height 90vh, swipe down + X).</raw>
      </component>
      <component id="toast" code="5.5" name="ToastOrSnackbar">
        <spec>
          <base height="48" radius="12" paddingMin="12" paddingMax="16" />
          <position>
            <mobile>하단(탭바 위 + safe area)</mobile>
            <web>우하단 또는 상단 중앙(정책 고정)</web>
          </position>
          <duration secondsMin="2.5" secondsMax="4" />
          <dismiss manualOptional="true" />
        </spec>
        <raw>높이 48, radius 12, padding 12~16. 모바일 하단(탭바 위), 웹 우하단/상단중앙. 지속 2.5~4s, 수동 닫기 옵션.</raw>
      </component>
      <component id="navigation" code="5.6" name="TabsAndAppBar">
        <spec>
          <bottomTab>
            <height value="64" note="+ safe" />
            <icon size="24" />
            <label fontSize="12" />
            <colors active="color.brand.600" inactive="color.neutral.60" />
          </bottomTab>
          <topAppBar>
            <height value="56" />
            <background token="bg.surface" />
            <divider position="bottom" width="1" token="border.default" />
          </topAppBar>
        </spec>
        <raw>Bottom Tab: height64(+safe), icon24, label12, active brand600/inactive neutral60. Top App Bar: height56, surface, bottom divider 1px.</raw>
      </component>
      <component id="waveform" code="5.7" name="Waveform">
        <spec>
          <base height="120" bgOptions="bg.subtle|bg.surface" colorBase="color.brand.300" colorPeak="color.brand.600" />
          <states>
            <state id="idle">잔잔한 고정(혹은 매우 느린 breathing)</state>
            <state id="recording">실시간(또는 시뮬) 애니메이션</state>
            <state id="paused">정지 + “일시정지” 라벨</state>
            <state id="processing">waveform blur/딤 + 로딩</state>
          </states>
        </spec>
        <raw>파형 높이 120, bg.subtle/surface, base brand.300, peak brand.600. 상태: Idle/Recording/Paused/Processing.</raw>
      </component>
      <component id="charts" code="5.8" name="Charts">
        <spec>
          <principles>
            <principle>“1개 핵심 점수 + 3~5개 보조 지표”를 1화면에 과밀하게 넣지 않기</principle>
            <principle>색은 브랜드 티얼 1개 + 뉴트럴 중심. 경고/오류에만 주황/빨강.</principle>
          </principles>
          <recommendedCharts>
            <chart id="ringGauge" name="Ring Gauge">
              <description>오늘의 마음 안정 지수(0–100)</description>
            </chart>
            <chart id="lineTrend" name="Line Trend">
              <description>최근 7일 안정 지수 추세</description>
            </chart>
            <chart id="metricBars" name="Metric Bars">
              <description>보조 지표(긴장/활력/집중/회복 등) 0–100 막대</description>
            </chart>
          </recommendedCharts>
          <labelRules>
            <rule>축/라벨은 text.caption, 값은 text.bodyStrong</rule>
            <rule>단위/설명(tooltip 또는 info): “0에 가까울수록 ~ / 100에 가까울수록 ~” 형태</rule>
          </labelRules>
        </spec>
        <raw>원칙: 핵심1+보조3~5, 색은 브랜드1+뉴트럴. 구성: Ring Gauge/Line Trend/Metric Bars. 표기: caption/strong + tooltip 설명.</raw>
      </component>
      <component id="audioPlayer" code="5.9" name="AudioPlayer">
        <spec>
          <miniPlayer optional="true">
            <height value="64" />
            <position>하단 고정(탭 위)</position>
          </miniPlayer>
          <fullPlayer>
            <containerOptions>
              <option>Bottom sheet</option>
              <option>전용 화면</option>
            </containerOptions>
          </fullPlayer>
          <controls>
            <control id="playPause" minTouchTarget="44" />
            <control id="seekBackward10s" minTouchTarget="44" />
            <control id="seekForward10s" minTouchTarget="44" />
            <control id="speed" component="Chip" />
            <control id="timer" component="Chip" />
          </controls>
          <backgroundRule>과한 일러스트 금지(저채도 그라데이션/블러)</backgroundRule>
        </spec>
        <raw>Mini player(옵션) height64 하단 고정. Full player: sheet/전용화면. Controls: 재생, 10초 전/후, 속도/타이머 칩.</raw>
      </component>
      <component id="listItem" code="5.10" name="ListItem">
        <spec>
          <heights base="56" dense="48" settings="56" />
          <left>
            <icon size="24" />
            <thumbnail width="40" height="40" radiusToken="radius.md" />
          </left>
          <body>
            <titleLines max="1" textToken="text.bodyStrong" />
            <subtitleLines max="1" textToken="text.caption" colorToken="text.secondary" />
          </body>
          <right>
            <item>상태 배지/시간</item>
            <item>chevron(설정/웹) 또는 더보기(⋯) 액션</item>
          </right>
          <interaction>
            <pressedBg token="color.neutral.10" />
            <focusRing supported="true" />
            <touchTargetMin value="44" unit="px" />
          </interaction>
          <swipe optional="true">
            <actions>
              <action>삭제</action>
              <action>공유</action>
            </actions>
            <rule>기본은 “더보기” 액션을 우선 고려(오작동 방지)</rule>
          </swipe>
        </spec>
        <raw>기본 높이 56(밀도 48/설정 56). 좌측 아이콘24 또는 40x40 썸네일. 제목1줄+보조1줄. pressed bg neutral.10, touch 44. 스와이프 옵션.</raw>
      </component>
      <component id="chip" code="5.11" name="Chip">
        <spec>
          <base height="32" paddingX="12" radiusToken="radius.pill" fontToken="text.caption">
            <note>caption 12~14</note>
          </base>
          <variants>
            <variant id="outline">
              <bgToken>bg.surface</bgToken>
              <borderToken>border.default</borderToken>
              <textToken>text.primary</textToken>
            </variant>
            <variant id="selected">
              <bgToken>color.brand.50</bgToken>
              <borderToken>color.brand.300</borderToken>
              <textToken>color.brand.700</textToken>
            </variant>
            <variant id="disabled">
              <opacity value="0.45" />
              <interactionOff>true</interactionOff>
            </variant>
          </variants>
          <withIcon>
            <iconSize value="16" />
            <gap value="6" />
          </withIcon>
        </spec>
        <raw>height32, paddingX12, radius pill. Outline/Selected/Disabled(0.45). 아이콘 16 + gap6.</raw>
      </component>
    </components>
  </componentsSpec>
  <screenSpecs code="6">
    <title>화면별 UX/UI 상세(핵심 화면)</title>
    <screen id="onboarding.permissions" code="6.1">
      <title>온보딩/권한</title>
      <goal>“왜 마이크가 필요한지”를 불안 없이 설명 → 동의/거부 모두 존중</goal>
      <rules>
        <rule>한 화면 1메시지 + 1CTA(Primary)</rule>
        <rule>권한 거부 시: “설정에서 허용” 안내 + Secondary 버튼 제공</rule>
      </rules>
      <requiredCopy>
        <copy>음성은 마음 상태 분석을 위해 사용돼요. 사용자는 언제든 삭제할 수 있어요.</copy>
      </requiredCopy>
    </screen>
    <screen id="home.dashboard" code="6.2">
      <title>홈/대시보드</title>
      <layout>
        <mobile>
          <section order="1" id="appBar" name="App Bar">
            <description>인사(“안녕하세요, ○○님”) + 프로필</description>
          </section>
          <section order="2" id="summaryCard" name="SummaryCard">
            <content>
              <item>큰 점수(오늘) + “마지막 측정: 2시간 전”</item>
              <cta tone="primary">지금 녹음하기</cta>
            </content>
          </section>
          <section order="3" id="trendCard" name="TrendCard">
            <description>7일 라인 차트(미니)</description>
          </section>
          <section order="4" id="adviceCard" name="AdviceCard">
            <content>
              <item>짧은 조언</item>
              <cta tone="primary">3분 호흡하기</cta>
            </content>
          </section>
          <section order="5" id="recentRecords" name="RecentRecords">
            <description>최근 3개 리스트 + “전체 보기”</description>
          </section>
        </mobile>
        <web>
          <rule>2컬럼(≥1024): 왼쪽 요약/조언, 오른쪽 차트/최근기록</rule>
          <rule>1컬럼(&lt;1024): 모바일과 동일 흐름</rule>
        </web>
      </layout>
      <states>
        <state id="emptyFirstUser">첫 사용자(기록 없음): SummaryCard 대신 “첫 기록 만들기” Empty state + CTA</state>
        <state id="loading">로딩: 카드 스켈레톤(높이 고정)</state>
      </states>
    </screen>
    <screen id="recording" code="6.3">
      <title>음성 녹음 화면</title>
      <goal>사용자가 “지금 무엇을 하면 되는지” 즉시 이해 (불필요 버튼 제거)</goal>
      <states>
        <state name="idle" label="준비(Idle)">
          <instructions>
            <instruction>안내: “조용한 곳에서 10~20초만 말해보세요.”</instruction>
            <instruction>Primary: 녹음 시작(L)</instruction>
            <instruction>보조: 녹음 팁 보기(Ghost)</instruction>
          </instructions>
        </state>
        <state name="recording" label="녹음 중(Recording)">
          <instructions>
            <instruction>중앙: 큰 Record 버튼(Stop로 전환) + 파형 + 타이머</instruction>
            <instruction>보조 버튼: 일시정지(Secondary) (필요 시만)</instruction>
            <instruction>피드백: 시작/정지 시 햅틱(약하게)</instruction>
          </instructions>
        </state>
        <state name="paused" label="일시정지(Paused)">
          <instructions>
            <instruction>파형 정지 + “일시정지됨”</instruction>
            <instruction>CTA: 계속 녹음(Primary) / 종료(Secondary)</instruction>
          </instructions>
        </state>
        <state name="processing" label="분석 중(Processing)">
          <instructions>
            <instruction>진행: 로딩 + “분석 중이에요(약 10초)”</instruction>
            <instruction>취소는 원칙적으로 숨김(불안/중단 유발) / 필요 시 “취소”는 Ghost로</instruction>
          </instructions>
        </state>
      </states>
      <errors>
        <error type="permissionDenied">권한 없음: 안내 + “설정으로 이동” 버튼</error>
        <error type="networkError">네트워크 오류: “다시 시도” Primary + “임시 저장 후 나중에” Secondary(가능 시)</error>
      </errors>
    </screen>
    <screen id="analysisResult" code="6.4">
      <title>분석 결과 화면</title>
      <informationStructure ordered="true">
        <item order="1">오늘의 점수(요약)</item>
        <item order="2">보조 지표(3~5개)</item>
        <item order="3">추세(7일)</item>
        <item order="4">텍스트 조언(행동 추천)</item>
        <item order="5">추천 명상(바로 실행)</item>
      </informationStructure>
      <layout>
        <mobile>
          <block order="1">상단: Ring Gauge + 점수(큰 숫자) + 한줄 요약(“오늘은 비교적 안정적인 편이에요”)</block>
          <block order="2">중단: Metric 카드 2×2 또는 세로 리스트</block>
          <block order="3">하단: 조언 카드(최대 5줄 + 더보기)</block>
          <cta tone="primary">3분 안정 가이드 시작</cta>
        </mobile>
      </layout>
      <states>
        <state id="noHistory">이전 기록 없음: 추세 대신 “기록을 쌓아 추세를 보여드릴게요”</state>
        <state id="partialFailure">부분 실패(지표 일부 없음): 해당 카드 “측정 불가” + info</state>
      </states>
      <sharing optional="true">
        <rule>공유는 기본 숨김</rule>
        <rule>사용자가 요청 시: “결과 이미지로 공유”(프라이버시 주의 문구 포함)</rule>
      </sharing>
    </screen>
    <screenGroup id="healingContent" code="6.5">
      <title>치유 콘텐츠(명상/가이드)</title>

      <screen id="healingContent.list" code="6.5.list">
        <title>리스트</title>
        <rules>
          <rule>카테고리(칩): 호흡 / 수면 / 불안 완화 / 집중 / 짧게(3~5분)</rule>
          <rule>카드: 썸네일(저채도) + 제목 + 시간 + 난이도</rule>
          <rule>정렬: 추천(기본) / 최신 / 짧은 순</rule>
        </rules>
      </screen>

      <screen id="healingContent.detail" code="6.5.detail">
        <title>상세</title>
        <rules>
          <rule>상단: 제목/설명/길이</rule>
          <rule>CTA: 재생(Primary)</rule>
          <rule>보조: 다운로드/오프라인(가능 시)</rule>
        </rules>
      </screen>

      <screen id="healingContent.player" code="6.5.player">
        <title>플레이어</title>
        <rules>
          <rule>진행바(스크러빙 가능), 현재/전체 시간</rule>
          <rule>버튼: 재생/일시정지(중앙), 10초 전/후, 속도(칩), 타이머(칩)</rule>
          <rule>종료 시: “어땠나요?”(2~3개 이모션 선택은 옵션) → 홈 추천에 반영(향후)</rule>
        </rules>
      </screen>
    </screenGroup>
    <screen id="library" code="6.6">
      <title>보관함(파일/데이터 관리)</title>
      <listRules>
        <rule>항목 최소 높이 56</rule>
        <rule>표시: 날짜/시간, 길이, 결과 요약(작은 배지), 상태(분석 완료/대기)</rule>
        <rule>액션: (모바일) 스와이프 삭제/공유 또는 (웹) 체크박스 다중 선택</rule>
      </listRules>
      <deleteUx>
        <warning>삭제하면 복구할 수 없어요.</warning>
        <confirmModalButtons>
          <button tone="destructive">삭제</button>
          <button tone="secondary">취소</button>
        </confirmModalButtons>
      </deleteUx>
    </screen>
    <screen id="settings.privacy" code="6.7">
      <title>설정/개인정보</title>
      <requiredItems>
        <item>마이크 권한/알림 권한 상태 표시 + 바로가기</item>
        <item>데이터: 내보내기(가능 시), 전체 삭제</item>
        <item>도움말: FAQ, 문의</item>
        <item>긴급 안내: “위기 상황 시 도움받기”(연락처/기관 링크는 서비스 정책에 맞춤)</item>
      </requiredItems>
    </screen>
  </screenSpecs>
  <accessibilityAndQuality code="7">
    <title>접근성(A11y) &amp; 품질 기준</title>
    <rules>
      <rule>터치 타겟: 44×44 이상</rule>
      <rule>폼: label 필수, 에러는 텍스트로 설명(색만으로 구분 금지)</rule>
      <rule>포커스: 웹 키보드 탭 순서=시각 순서, 포커스 링 표시</rule>
      <rule>텍스트 확대: 레이아웃 깨짐 없이 120~140%까지 대응</rule>
      <rule>로딩: 스켈레톤/고정 높이로 점프 방지</rule>
      <rule>민감정보: 공유/스크린샷 유도 시 프라이버시 경고 문구</rule>
    </rules>
  </accessibilityAndQuality>
  <devHandoff code="8">
    <title>개발 핸드오프(권장 규칙)</title>

    <tokenImplementation code="8.1">
      <platform type="web">
        <rule>CSS 변수로 semantic 토큰을 우선 노출</rule>
      </platform>
      <platform type="app">
        <rule>Theme 객체로 semantic 토큰을 우선 사용(다크 확장 대비)</rule>
      </platform>
      <codeSamples lang="css">
        <code>--bg-canvas: #F7F5F2;</code>
        <code>--bg-surface: #FFFFFF;</code>
        <code>--text-primary: #1A1F1E;</code>
        <code>--brand-600: #1C7C6B;</code>
      </codeSamples>
    </tokenImplementation>

    <figmaStructure code="8.2">
      <pages>
        <page>00 Foundations</page>
        <page>01 Components</page>
        <page>02 Screens</page>
        <page>03 Prototypes</page>
      </pages>
      <componentsVariants>
        <component name="Button">
          <variant name="variant">primary/secondary/ghost</variant>
          <variant name="size">L/M/S</variant>
          <variant name="state">default/disabled/loading</variant>
        </component>
        <component name="Input">
          <variant name="state">default/focus/error/disabled</variant>
        </component>
        <component name="Card">
          <variant name="type">summary/metric/advice/content</variant>
        </component>
      </componentsVariants>
    </figmaStructure>
  </devHandoff>
  <releaseScope code="9">
    <title>릴리스 1차 범위(디자인 산출물 최소셋)</title>
    <list ordered="false">
      <item>핵심 5 플로우: 온보딩, 홈, 녹음, 결과, 명상 플레이어</item>
      <item>보관함/설정은 기본 기능 위주(삭제/공유/권한/데이터)</item>
    </list>
  </releaseScope>
  <appendices>
    <appendix code="A" title="화면별 공통 컴포넌트 체크리스트">
      <checklist>
        <checkItem checked="false">App Bar 규격(56) 준수</checkItem>
        <checkItem checked="false">Primary CTA는 화면당 1개가 기본</checkItem>
        <checkItem checked="false">카드 패딩 16, radius 16</checkItem>
        <checkItem checked="false">본문 16px, 보조 12px</checkItem>
        <checkItem checked="false">상태(로딩/에러/빈상태) 제공</checkItem>
        <checkItem checked="false">접근성 라벨/포커스/터치타겟 준수</checkItem>
      </checklist>
    </appendix>

    <appendix code="B" title="QA/검수 시나리오 (UX/기능)">
      <purpose>권한/네트워크/상태 변화까지 포함하여, 앱/웹에서 동일한 사용자 경험이 보장되는지 확인합니다.</purpose>

      <scenarioGroup code="B.1" title="온보딩/권한">
        <scenario>약관/개인정보 동의: 필수 항목 미체크 시 CTA 비활성/에러 안내</scenario>
        <scenario>마이크 권한: 허용/거부/재요청 흐름(설정 이동 포함)</scenario>
        <scenario>권한 거부 상태에서 녹음 진입: 안내 화면 + 대체 CTA 제공</scenario>
      </scenarioGroup>

      <scenarioGroup code="B.2" title="녹음">
        <scenario>시작/일시정지/재개/종료 동작 및 라벨/아이콘 상태 전환</scenario>
        <scenario>백그라운드/전화/알림 등 인터럽트 발생 시 UX(자동 일시정지/안내)</scenario>
        <scenario>권한 없음, 저장공간 부족(가능 시), 마이크 사용 중(다른 앱) 등 예외 처리</scenario>
        <scenario>소음 과다(옵션): 경고 배너/문구 노출, 재녹음 유도(비난 금지)</scenario>
      </scenarioGroup>

      <scenarioGroup code="B.3" title="분석(업로드/처리)">
        <scenario>처리 로딩(스켈레톤/프로그레스) 노출, 예상 소요 안내 문구</scenario>
        <scenario>네트워크 오류: 재시도/나중에 처리(가능 시 임시저장) UX</scenario>
        <scenario>결과 없음/부분 실패(지표 일부 누락): “측정 불가” 상태 + 설명 노출</scenario>
      </scenarioGroup>

      <scenarioGroup code="B.4" title="결과(시각화/조언)">
        <scenario>그래프/차트: 모바일/웹에서 축/라벨/값이 겹치지 않고 가독성 유지</scenario>
        <scenario>텍스트 조언: 길이 변화(짧음/김)에서 레이아웃 안정(더보기/접기)</scenario>
        <scenario>공유/저장(옵션): 민감정보 경고 문구, 공유 범위 안내</scenario>
      </scenarioGroup>

      <scenarioGroup code="B.5" title="명상/치유 콘텐츠">
        <scenario>리스트/필터(Chip)/검색(옵션): 상태 유지, 빈 결과 처리</scenario>
        <scenario>플레이어: 재생/일시정지/seek, 타이머 종료, 속도 변경</scenario>
        <scenario>백그라운드/잠금화면(플랫폼 정책 범위 내)에서 컨트롤/중단 처리</scenario>
      </scenarioGroup>

      <scenarioGroup code="B.6" title="파일/데이터 관리(보관함/설정)">
        <scenario>삭제(단일/다중): 확인 모달, 취소 시 원복, 삭제 후 리스트 갱신</scenario>
        <scenario>공유: 파일/결과 공유 시 프라이버시 문구 표시(옵션)</scenario>
        <scenario>데이터 내보내기/전체 삭제(옵션): 위험 경고 + 2단계 확인(가능 시)</scenario>
      </scenarioGroup>

      <scenarioGroup code="B.7" title="접근성(A11y)">
        <scenario>터치 타겟 44×44 이상(모바일), 웹 포커스 링/키보드 탭 순서 검증</scenario>
        <scenario>스크린리더: 아이콘 버튼/차트 정보 버튼 aria-label(또는 접근성 라벨) 제공</scenario>
        <scenario>색 대비 4.5:1, 텍스트 확대(120~140%)에서 줄바꿈/오버플로우 점검</scenario>
      </scenarioGroup>
    </appendix>
  </appendices>
</uiuxSpec>
