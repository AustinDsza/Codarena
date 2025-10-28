# Judge0 API Integration Setup

This project now includes Judge0 API integration for real-time code execution in contests.

## Setup Instructions

### 1. Get Judge0 API Access

1. Go to [RapidAPI Judge0](https://rapidapi.com/judge0-official/api/judge0-ce/)
2. Subscribe to the Judge0 API (free tier available)
3. Get your API key from the dashboard

### 2. Environment Variables

Create a `.env.local` file in your project root and add:

```env
# Judge0 API Configuration
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your_rapidapi_key_here
```

### 3. Features Included

#### API Routes
- `POST /api/judge0/submit` - Submit code for execution
- `GET /api/judge0/result?token=<token>` - Get execution result
- `GET /api/judge0/languages` - Get supported languages

#### Client Service
- `lib/judge0-service.ts` - Client-side service for interacting with Judge0
- `components/CodeExecution.tsx` - React component for code execution UI

#### Supported Languages
- Python 3
- JavaScript (Node.js)
- Java
- C++
- C
- C#
- Go
- Rust
- PHP
- Ruby
- Swift
- Kotlin
- Scala
- TypeScript

### 4. Usage in Contests

The CodeExecution component is automatically integrated into the contest editor:

```tsx
<CodeExecution
  code={code}
  language={language}
  testCases={problem?.testCases || []}
  onExecutionComplete={(result) => {
    // Handle execution result
  }}
/>
```

### 5. Test Cases Format

Test cases should be provided in this format:

```typescript
testCases: [
  {
    input: "1 2 3",
    expectedOutput: "6",
    description: "Sum of three numbers"
  },
  {
    input: "5 10",
    expectedOutput: "15",
    description: "Sum of two numbers"
  }
]
```

### 6. Execution Limits

- **Time Limit**: 2 seconds per execution
- **Memory Limit**: 128MB per execution
- **Concurrent Executions**: Limited by Judge0 API plan

### 7. Error Handling

The service includes comprehensive error handling for:
- Network errors
- API rate limits
- Code compilation errors
- Runtime errors
- Timeout errors

### 8. Security Features

- Input validation on both client and server
- Time and memory limits to prevent abuse
- Error sanitization to prevent information leakage

## Testing

1. Start the development server: `pnpm run dev`
2. Navigate to a contest editor page
3. Write some code and click "Run Code"
4. Check the execution results in the output panel

## Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify your RapidAPI key is correct
   - Check if you have an active subscription
   - Ensure the key has proper permissions

2. **Code Not Executing**
   - Check browser console for errors
   - Verify network connectivity
   - Check if Judge0 API is accessible

3. **Test Cases Failing**
   - Ensure input/output format matches exactly
   - Check for whitespace differences
   - Verify expected output is correct

### Debug Mode

Enable debug logging by adding to your browser console:
```javascript
localStorage.setItem('debug', 'judge0')
```

## Production Considerations

1. **Rate Limiting**: Implement proper rate limiting for production
2. **Caching**: Consider caching results for repeated executions
3. **Monitoring**: Add monitoring for API usage and errors
4. **Fallback**: Implement fallback execution methods if needed

## Support

For issues related to:
- Judge0 API: Contact RapidAPI support
- Integration: Check this project's documentation
- Code execution: Review the error messages in the UI
