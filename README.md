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

### Hiển thị lỗi đúng cách (Check lỗi khi RunTime)

> [!NOTE]
> Đối với lỗi từ phía người dùng status code 400 nên hiển thị lỗi thông quá lable focus vị trí lỗi để gây sự chú ý cho người dùng khiến học nhanh chóng tìm thấy vị trí lỗi

![image](https://github.com/quocbinh-npm9081/Destroy-RTKQuery/assets/68917523/53ac7ca4-bba8-49f3-811f-766cff9bdfe2)

> [!NOTE]
> Đối với lỗi từ phía Server status code 500 ta nên sử dụng Alert Toast hiển thị lỗi

![image](https://github.com/quocbinh-npm9081/Destroy-RTKQuery/assets/68917523/46a193ca-a8aa-4c6b-af43-f4a00c6d0877)

> [!NOTE]
> Đối với những đoạn code có khả năng bị lỗi cao trong tương lai thì ta sử dụng Try Catch, các lỗi được Catch ném ra ta nên xử lý chúng thông qua throw và show ra Alert thong qua toast, sau này nhiều người join vô team họ code sai lỗi thì lỗi sẽ dc show lên khi Runtime điều này giảm thiểu thời gian Fix code

![image](https://github.com/quocbinh-npm9081/Destroy-RTKQuery/assets/68917523/a26cb5a9-b8e1-47d2-9773-4dc9ed3fbce6)

Như bạn thấy biến a không có property b như ai đó vẫn cố tình truy cập đến b, điều này sẽ xảy ra lỗi khi Runtime ta cần bắt lỗi nó với catch và show Runtime alert

![image](https://github.com/quocbinh-npm9081/Destroy-RTKQuery/assets/68917523/a26cb5a9-b8e1-47d2-9773-4dc9ed3fbce6)
