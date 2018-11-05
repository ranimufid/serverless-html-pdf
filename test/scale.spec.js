'use strict'

const scale = require('../functions/scale.js')

const mapping = [
  { name: 'ALARM: "sqs-worker-serverless-dev-MessageAlarm1-1NIBQAPLRXXF6', change: 1 },
  { name: 'OK: "sqs-worker-serverless-dev-MessageAlarm1-1NIBQAPLRXXF6', change: -1 },
  { name: 'ALARM: "sqs-worker-serverless-dev-MessageAlarm100-1NIBQAPLRXXF6', change: 3 },
  { name: 'OK: "sqs-worker-serverless-dev-MessageAlarm100-1NIBQAPLRXXF6', change: -3 },
  { name: 'ALARM: "sqs-worker-serverless-dev-MessageAlarm1000-1NIBQAPLRXXF6', change: 5 },
  { name: 'OK: "sqs-worker-serverless-dev-MessageAlarm1000-1NIBQAPLRXXF6', change: -5 },
  { name: 'ALARM: "sqs-worker-serverless-dev-MessageAlarm2000-1NIBQAPLRXXF6', change: 10 },
  { name: 'OK: "sqs-worker-serverless-dev-MessageAlarm2000-1NIBQAPLRXXF6', change: -10 },
  { name: 'ALARM: "sqs-worker-serverless-dev-MessageAlarm5000-1NIBQAPLRXXF6', change: 15 },
  { name: 'OK: "sqs-worker-serverless-dev-MessageAlarm5000-1NIBQAPLRXXF6', change: -15 },
  { name: 'LOREM: "sqs-worker-serverless-dev-MessageAlarm2000-1NIBQAPLRXXF6', change: 0 }
]

it('should convert alert to change', () => {
  mapping.forEach(element => {
    expect(scale.parse(element.name)).toBe(element.change)
  })
})
