import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@/App.css'
import Dashboard from '@/pages/Dashboard'
import { ThemeProvider } from '@/context/theme/ThemeProvider';
import PortfolioProvider from '@/context/portfolio/PortfolioProvider';
import { Route, Routes } from 'react-router';
import NotFound from '@/pages/NotFound';

// ## Features

// **Core:**

// -- Display 100 initial coins with price, coin name, and other properties as you see them here
// -- Filters: price range, market cap, volume, gainers/losers => sau khi filter xog thì vẫn cho sort theo kqua của filter
//    => free tier api chỉ cho sort theo 1 category duy nhất
// -- Sort by: Price/Coin/Other fields on the table
//    => chỉ đc sort theo coin name, market_cap, volume
// -- Only the table dashboard is the important part of this practice; don’t pay attention to the navbar or cards above on the website. These are nice to have, but the core of it is the table of coins and its functionality.

// **Bonus:**

// -- Real-time updates (60s interval)
// -- Dark mode toggle (persist preference)
// -- Add coins to favorites
// -- Go to top
// -- Pagination => nhưg nếu filter theo category (dù có params pagination trg request hay ko) thì cx chỉ trả về 100 coin và m ko bik tổg coin của category này là bnh
//  => nếu category là all thì hiện totalCoins vs totalPages, nếu chọn category cụ thể thì nút totalpage là curentPage + 1 ? (ko show totalCoins, cx như để ý logic của nút next page nx)
// --------- Query on url (optional), change currency, search by keyword

// ### Performance
// -- skeleton table ?
// -- React.memo for coin cards/ rows
// -- Virtual scrolling for 100+ items => dùg css (hỏi anti)
// -- useCallback - optimize handlers => PaginationButton và SortArrow nhận trực tiếp hàm set 1 state lun nên đã có tham chiếu cố định, ko cần useCallback
// -- useMemo - memoize filtered/sorted results => m filter vs sort trực típ ở api chứ logic filter vs sort ko nằm ở ui nên ko useMemo kqua filter vs sort
//     => memoize paginationNumbers thì đc
// -- Query invalidation
// -- refetchInterval - auto-refresh every 60s
// -- staleTime - cache management
// -- enabled - conditional fetching
// -- Unit testing (component, hooks, service, context trừog hợp tốt và xấu đều hoạt độg đúg mog đợi)
// - Tối ưu code hơn (tự nghĩ trc r hỏi AI)

// doc: https://docs.coingecko.com/demo/reference/coins-markets?playground=open
// api: https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&sparkline=true&price_change_percentage=1h,7d&precision=2
// web: web nó sort trườg coin name theo tổg coin nhưg trườg market cap thì trên coin trg page htai th
// tạo mock data vs dùg js bằg tay để xli pagination trc khi gọi api (vì api ghan số lần gọi 1p)

// https://www.skool.com/devmastery/-/search?q=crypto&t=posts&p=1
//      get coin list w name, price, price change in percentage in 24h, total volume and market cap - https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd
//      get price change in percentage in 1h/7d - https://api.coingecko.com/api/v3/coins/bitcoin 
//      get price data in last 7d - https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <div className="dark:bg-gray-900 dark:text-gray-400 min-h-screen">
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <PortfolioProvider>
                <Routes>
                  <Route index element={<Dashboard/>}/>
                  <Route path="*" element={<NotFound/>}/>
                </Routes>
              </PortfolioProvider>
            </ThemeProvider>
        </QueryClientProvider>
      </div>
    </>
  )
}

export default App;