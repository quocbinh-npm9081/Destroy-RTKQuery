// Phương pháp Type predicate dùng để thu hệp kiểu của một biến

import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import { SerializedError } from '@reduxjs/toolkit'

// Kiểu ErrorFormObject dành cho trường hợp tổng quát

interface ErrorFormObject {
  [key: string | number]: string | ErrorFormObject | ErrorFormObject[]
}

interface EntityError {
  status: 422
  data: {
    error: ErrorFormObject
  }
}

// Đầu tiên chúng ta sẽ khai báo func check kiểm tra cấu trúc về mặc logic Javascript
// Tieps theo chúng ra thêm 'parameterName is Type' làm kiểu return của func thay vì boolean
// Khi dùng func kiểu tra kiểu này, ngoài việc kiểm tra vè mặt logic cấu trúc, nó còn chuyển kiểu
// So sánh với phương pháp ép kiểu 'Type Assertions' thì ép kieur chúng giúp chúng ta về mặt Type nhưng lại chưa chắc về mặt Login

// Ta sẽ viết 1 function kiểm tra thu hệp kiểu chuyển về 'FetchBaseQueryBase'

export function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  //Kiểm tra cái error truyền vào phải là objectm errro != null và bên trong error phải tonnf tại key status
  //Đủ cá kiểu kiên này thì nó mới là isFetchBaseQueryError
  return typeof error === 'object' && error !== null && 'status' in error
}

export function isSeriallizedError(error: unknown): error is SerializedError {
  return typeof error === 'object' && error != null && 'message' in error && typeof (error as any).message === 'string'
}

export function isEntityError(error: unknown): error is EntityError {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions, no-unreachable

  return (
    isFetchBaseQueryError(error) &&
    error.status === 422 &&
    typeof error.data === 'object' &&
    error.data !== null &&
    !(error.data instanceof Array)
  )
}

export class CustomError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CustomError'
  }
}
