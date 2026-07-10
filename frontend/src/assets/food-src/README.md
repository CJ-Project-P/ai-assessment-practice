# food-src

"음식 기억하기" 게임에서 쓰는 메뉴 사진 원본. 모두 **동일 크기의 동그란 검정색 그릇**에 담긴 구도로 통일.

이 폴더는 원본(용량 커도 됨)만 두는 곳이라 git에 커밋되지 않는다(`.gitignore` 참고).
실제로 앱이 쓰는 최적화 이미지는 `../food/*.webp`이며, 아래 명령으로 이 폴더에서 자동 생성된다.

```
npm run optimize:images
```

사진을 새로 추가하거나 교체할 때는 이 폴더에 원본만 넣고 위 명령을 다시 실행하면 된다.

파일명 규칙: 아래 이름 그대로 `.jpg` 또는 `.png`로 이 폴더에 넣으면 됨.

| 파일명 | 메뉴 |
|---|---|
| udon | 우동 |
| kimchi-jjigae | 김치찌개 |
| gimbap | 김밥 |
| steak | 스테이크 |
| suyuk | 수육 |
| tangsuyuk | 탕수육 |
| jeon | 전 |
| samgyeopsal | 삼겹살 |
| egg-fried-rice | 계란볶음밥 |
| donkatsu | 돈까스 |
| tteokbokki-egg | 계란 하나 올려진 떡볶이 |
| sundae | 순대 |
| gopchang | 곱창 |
| hamburger | 햄버거 |
| sushi | 초밥 |
| doenjang-guk | 된장국 |
| chicken | 치킨 |
| jjajangmyeon | 짜장면 |
| mandu | 만두 |
| jjamppong | 짬뽕 |
| pizza | 피자 |
| jokbal | 족발 |
| grilled-fish | 생선구이 |
| sashimi | 회 |

예: 우동 사진 → `udon.jpg`
