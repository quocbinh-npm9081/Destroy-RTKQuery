# Báo cáo thực tập ngày 3

## Trước ghi clone Project này về hãy clone Server về trước để đảm bảo Website có dữ liệu

```
git clone https://github.com/quocbinh-npm9081/dummyServer-EZTEK-RTK.git
```

## Quy ước lỗi trả về từ Server

Server phải trả ề một kiểu lỗi thống nhất, không thể trả về tùy tiện được.

Ở đây Server của em (JSON server) cấu hình trả vè hai kiểu lỗi

> Nếu bạn đăng 1 bài Post có thời gian tạo (publishDate nằm ở quá khứ thì không cho tạo)

```ts
{
  error:{
          publishDate: "Không được publish vào thời điểm trong quá khứ",
        },
}
```

```ts
interface EnityError {
  [key: string | number]: string | EnityError | EnityError[]
}
```

## Xử lý lỗi bằng RTK Query khi nhận được lỗi từ server

> [!NOTE]
> Tài liệu về handling error đầy đủ tại đây [GitHub Pages](https://redux-toolkit.js.org/rtk-query/usage-with-typescript#type-safe-error-handling).

Sẽ có 2 kiểu lỗi mà RTK cung cấp FetchBaseQueryError | SerializedError

- FetchBaseQueryError

RTK trả về định dạng lỗi này ghi fetch API bị lỗi

- SerializedError

```ts
export interface SerializedError {
  name?: string
  message?: string
  stack?: string
  code?: string
}
```

RTK trả về lỗi này dưới dạng SerializedError khi người dùng đặt throw new Error trong endPoints
