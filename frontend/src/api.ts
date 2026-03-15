import axios from 'axios'
import { BacktestRequest, BacktestResponse } from './types'

const BASE_URL = 'http://localhost:8000'

export async function runBacktest(req: BacktestRequest): Promise<BacktestResponse> {
  const { compare_strategies, ...payload } = req
  const response = await axios.post(`${BASE_URL}/backtest`, payload)
  return response.data
}
