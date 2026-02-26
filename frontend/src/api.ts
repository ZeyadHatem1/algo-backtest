import axios from 'axios'
import { BacktestRequest, BacktestResponse } from './types'

const BASE_URL = 'http://localhost:8000'

export async function runBacktest(req: BacktestRequest): Promise<BacktestResponse> {
  const response = await axios.post(`${BASE_URL}/backtest`, req)
  return response.data
}