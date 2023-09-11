# Báo cáo thực tập ngày 1

## Trước ghi clone Project này về hãy clone Server về trước để đảm bảo Website có dữ liệu

```
git clone https://github.com/quocbinh-npm9081/dummyServer-EZTEK-RTK.git
```

## RTK query là gì?

RTK query là thư viện thuộc hệ sinh thái Redux giúp chúng ta quản lý việc gọi API và caching dễ dàng.

### Lý do RTK query xuất hiện

Giúp chúng ta hạn chế những việc lặp đi lặp lại trong quá trình fetch data.

Để fetch data trong React

- Khai báo useEffect và gọi API trong đó
- Xử lý cleanup function để tránh việc gọi duplicate data
- Tracking trạng thái loading để hiển thị skeleton
- Quản lý thời gian cache khi user tương tác với UI

Những việc này không khó, nhưng nó nhiều, nếu nhiều component cần implement cái này thì khá mệt. Nếu dùng với Redux thì mệt hơn nữa khi mỗi lần gọi API phải khai báo action, thunk các kiểu. Ngay cả khi khi chúng ta sử dụng `createAsyncThunk` cùng với `createSlice` thì vẫn còn những hạn chế khi chúng ta phải tự quản lý state loading hay tránh gọi duplicate request.

Những năm gần đây, cộng đồng React nhận ra rằng **fetch data và caching cũng là một nỗi lo khác cùng với việc quản lý state**.

RTK Query lấy cảm hứng từ những thư viện như Apollo Client, React Query, Urql và SWR nhưng được build trên Redux Toolkit

## UI templete

![image](https://github.com/quocbinh-npm9081/Destroy-RTKQuery/assets/68917523/26df1a9a-80d2-468c-bd0e-70a038292e39)

## Get Api with RTK 

![image](https://github.com/quocbinh-npm9081/Destroy-RTKQuery/assets/68917523/bfbe0d28-5949-4dee-84c4-6288dfa19161)
## Redux devtool check work flow

![workflow](https://github.com/quocbinh-npm9081/Destroy-RTKQuery/assets/68917523/c0ebae72-b1bc-4d97-85bf-b2e4b1d6d779)
