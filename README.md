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

## Xây dựng chức năng thêm , cập nhâp (POST, PUT)

Những method bên trong 1 SliceApi

- baseQuery được dùng cho mỗi endpont để fetch api vd: host server của ta có adress là **http://localhost4000/** ta sẽ call api đến host này
- endPoints: Là nới mà ta viết các method làm việc với API, bao gồm có 2 kiểu là query và mutation
- query thường dùng cho GET
- mutation: thường dùng cho các trường hợp thay đổi dữ liệu trên server ở đây là POST PUT DELETE

Post là responsive trả về và Omit<Post, 'id'> là body gửi lên (đã loại bỏ id) nếu là Partial<Post> có ngĩa là body gửi lên có thể thiếu 1 số thuộc tính của Post

> [!NOTE]
> Lưu ý xem code ví dụ trong file /src/pages/blog/blog.services.ts

### Cập nhập UI sau khi thực hiện POST, PUT,...

- Cách 1: Cách truyền thống như trước giờ vẫn làm đó là post body lên seveer là server trả về dữ liệu của post đó

  1.Lấy dữ liệu server trả về và update vào state redux

  2.React thấy state Redux thay đổi nên nó sẽ automatically re-render update ui

> [!WARNING]
> Rủi ro ==> là nếu khi gọi request add post mà server trả về data không đủ các field để chúng ta hiển thị thì sẽ bị lỗi hoặc bắt buộc handle rất mệt, Chưa kể chúng ra phải quản lú việc cập nhập state trong redux rất mêt( I so mother fucking tired)

- Cách 2: Đây là cách thường dùng với RTK query

1. Sau khi post lên server , server sé trả về dữ liệu của post đó
2. Ta không sử dụng dữ liệu trả về mà tiến hành call api get toàn bộ 1 lần nữa
3. Lấy dữ liệu từ lần call get api để update state redux
   => ui update

> ====> Điều này đảm bảo dữ liệu phía dưới local luôn luôn mới, Việc này dẫn đến phải call them 1 lần nữa nhưng như vậy là không đáng kể

```

```
