import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary bắt lỗi:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
          Đã xảy ra lỗi. Vui lòng thử lại.
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;