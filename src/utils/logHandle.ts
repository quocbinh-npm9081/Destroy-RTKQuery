export const log = (msg: string, cl: string) => {
  let color: string = cl || 'black'
  let bgc: string = 'White'
  switch (color) {
    case 'success':
      color = 'Green'
      bgc = 'LimeGreen'
      break
    case 'info':
      color = 'DodgerBlue'
      bgc = 'Turquoise'
      break
    case 'error':
      color = 'Red'
      bgc = 'Black'
      break
    case 'start':
      color = 'OliveDrab'
      bgc = 'PaleGreen'
      break
    case 'warning':
      color = 'Tomato'
      bgc = 'Black'
      break
    case 'end':
      color = 'Orchid'
      bgc = 'MediumVioletRed'
      break
    default:
      color = cl
  }

  if (typeof msg == 'object') {
    console.log(msg)
  } else if (typeof color == 'object') {
    console.log('%c' + msg, 'color: PowderBlue;font-weight:bold; background-color: RoyalBlue;')
    console.log(color)
  } else {
    console.log('%c' + msg, 'color:' + color + ';font-weight:bold; background-color: ' + bgc + ';')
  }
}
