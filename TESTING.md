# Testing Guide

Bu proje Jest ve React Native Testing Library kullanarak unit testler içerir.

## Test Kurulumu

### Gerekli Bağımlılıklar

```bash
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native jest-environment-jsdom @types/jest react-test-renderer
```

### Jest Konfigürasyonu

Jest konfigürasyonu `jest.config.js` dosyasında tanımlanmıştır:

- **Preset**: `react-native`
- **Test Environment**: `node`
- **Setup Files**: `jest.setup.js`
- **Module Name Mapping**: `@/*` path alias'ı desteklenir
- **Coverage**: Components, hooks ve queries klasörleri için coverage raporu

## Test Komutları

```bash
# Tüm testleri çalıştır
npm test

# Testleri watch modunda çalıştır
npm run test:watch

# Coverage raporu ile testleri çalıştır
npm run test:coverage

# Debug modunda testleri çalıştır (memory leak detection)
npm run test:debug

# CI/CD için testleri çalıştır
npm run test:ci
```

## Test Yapısı

```
__tests__/
├── components/          # Component testleri
│   ├── Button.test.tsx
│   ├── ListItem.test.tsx
│   └── TaskItem.test.tsx
├── hooks/              # Custom hook testleri
│   └── useTasks.test.tsx
├── queries/            # Query function testleri
│   └── tasks.test.ts
└── utils/              # Test utilities
    └── test-utils.tsx
```

## Test Kapsamı

### Component Testleri

- **Button**: Loading state, disabled state, onPress events
- **TaskItem**: Task rendering, completion state, priority display, haptic feedback
- **ListItem**: List rendering, delete functionality, date formatting

### Hook Testleri

- **useTasks**: Query hooks, mutation hooks, error handling
- **useCreateTask**: Task creation with optimistic updates
- **useUpdateTask**: Task updates
- **useDeleteTask**: Task deletion
- **useToggleTaskCompletion**: Task completion toggling

### Query Testleri

- **tasks.ts**: Database query functions
- **getAllTasks**: Fetch all tasks
- **getTaskById**: Fetch specific task
- **createTask**: Create new task
- **updateTask**: Update existing task
- **deleteTask**: Delete task
- **searchTasksByName**: Search functionality

## Test Utilities

`__tests__/utils/test-utils.tsx` dosyası test yardımcı fonksiyonları içerir:

- **createMockTask**: Mock task objesi oluşturur
- **createMockList**: Mock list objesi oluşturur
- **mockOnToggle**: Mock toggle function
- **mockOnDelete**: Mock delete function
- **mockOnPress**: Mock press function

## Mock'lar

`jest.setup.js` dosyasında aşağıdaki modüller mock'lanmıştır:

- **expo-haptics**: Haptic feedback
- **expo-sqlite**: Database operations
- **drizzle-orm**: ORM operations
- **@react-native-async-storage/async-storage**: Local storage
- **@react-native-community/netinfo**: Network info
- **react-native-reanimated**: Animations
- **react-native-gesture-handler**: Gesture handling
- **react-native-toast-message**: Toast notifications

## Coverage

Mevcut test coverage:

- **Components**: %25.8 (Button, ListItem, TaskItem tam coverage)
- **Hooks**: %44.5 (useTasks hook'u test edilmiş)
- **Queries**: %62.29 (tasks.ts tam coverage)

## Test Yazma İpuçları

1. **Component Testleri**: Render, user interactions, props validation
2. **Hook Testleri**: Query states, mutation results, error handling
3. **Query Testleri**: Database operations, return values, error cases
4. **Mock Kullanımı**: External dependencies'leri mock'layın
5. **Test Isolation**: Her test bağımsız olmalı

## Örnek Test

```typescript
import { render, fireEvent } from '../utils/test-utils';
import { Button } from '@/components/Button';

describe('Button Component', () => {
  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={mockOnPress} />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
```

## Sorun Giderme

### Yaygın Hatalar

1. **Module not found**: Path alias'ları kontrol edin
2. **Mock errors**: jest.setup.js'deki mock'ları kontrol edin
3. **Async test errors**: `waitFor` kullanın
4. **Provider errors**: Test utilities'deki provider setup'ını kontrol edin
5. **Worker process failed**: Memory leak'leri tespit etmek için `npm run test:debug` kullanın

### Memory Leak Çözümleri

Worker process hatası için aşağıdaki çözümler uygulanmıştır:

- **Cleanup Functions**: Her test sonrası mock'lar ve timer'lar temizlenir
- **QueryClient Cleanup**: React Query client'ı düzgün temizlenir
- **Force Exit**: Jest konfigürasyonunda `forceExit: true` ayarı
- **Max Workers**: `maxWorkers: 1` ile worker sayısı sınırlandırılır

### Debug

```bash
# Verbose output ile test çalıştır
npm test -- --verbose

# Memory leak detection ile test çalıştır
npm run test:debug

# Specific test file çalıştır
npm test Button.test.tsx

# Coverage ile debug
npm run test:coverage -- --detectOpenHandles
```
