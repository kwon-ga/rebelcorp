# 문제 2

아래의 요구 사항에 맞는 테이블을 설계하여 ERD를 작성해 주세요

기초 테이블 정의를 바탕으로 작성하며,
유저스토리에 따라 테이블의 수정 및 추가를 하실 수 있습니다

## 기초 테이블 정의

- **user** table은 이름(name), 이메일(email), 패스워드(password), 가입일(created_at)을 가지고 있다.
- **post** table은 글제목(title), 본문(content), 글 작성일(created_at), 작성자(user_id)를 가지고 있다
- **tag** table은 태그명(name), 태그 생성일(created_at)을 가지고있다

### 유저 스토리

- user는 post를 작성할수 있다
- user는 post는 복수의 tag를 추가 할수있다
- user는 탈퇴처리 처리가 가능해야한다
- user가 탈퇴 되더라도, post는 삭제되서는 안된다
- tag로 post를 검색할수 있어야 한다

---

✅ ERD

```
+------------------+
|      User         |
+------------------+
| id (PK)           |
| name              |
| email (UNIQUE)    |
| password          |
| created_at        |
| status (TINYINT)  | → 유저 활성화 비활성화 여부
| deleted_at        | → soft delete를 고려
+------------------+
        │
        │ 1
        │
        │ N
+------------------+
|      Post       |
+------------------+
| id (PK)         |
| title           |
| content         |
| created_at      |
| user_id (FK)    | → User(id) ON DELETE SET NULL
+------------------+
        │
        │ N
        │
        │ M
+------------------+      +------------------+
|      Post_Tag   |       |      Tag         |
+------------------+      +------------------+
| post_id (FK)    |───N──▶| id (PK)          |
| tag_id (FK)     |       | name (UNIQUE)    |
+------------------+      | created_at       |
                          +------------------+


```

---

### 💡 추가질문 - 성능을 개선하기 위한 아이디어를 제시해 주세요

1. `유저 스토리를 기반으로 추가한 성능 개선`

- tag.name 컬럼 인덱스 추가
- post_tag.tag_id 컬럼 인덱스 추가

`예시 쿼리`

```sql
SELECT p.*
FROM post p
JOIN post_tag pt ON p.id = pt.post_id
JOIN tag t ON pt.tag_id = t.id
WHERE t.name IN ('경제', '정치')
GROUP BY p.id
ORDER BY p.id DESC
LIMIT 20 OFFSET 0;
```

2. `태그 검색 + 게시글 제목 + 컨텐츠 내용 검색`

- tag.name 컬럼 인덱스 추가
- post_tag.tag_id 컬럼 인덱스 추가
- post.title & post.content full text 인덱스 추가

더 세분화된 검색을 통한 사용자 경험 향상이 가능할 것으로 판단됨

`예시 쿼리`

```sql
SELECT p.*
FROM post p
JOIN post_tag pt ON p.id = pt.post_id
JOIN tag t ON pt.tag_id = t.id
WHERE t.name IN ('경제', '정치')
AND MATCH(p.title, p.content) AGAINST ('관세')
GROUP BY p.id
ORDER BY p.id DESC
LIMIT 20 OFFSET 0;
```

---

`고려해볼 사항`

- post_tag 테이블의 복합 인덱스 (tag_id, post_id)

→ 추후 post 테이블의 양이 기하급수적으로 많아진다면 인덱스의 크기 또한 증가  
→ 성능 저하를 고려하여 해당 설계에서는 제외
