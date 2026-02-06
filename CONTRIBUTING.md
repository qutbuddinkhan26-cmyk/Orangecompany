# Contributing to ServiceHub

Thank you for considering contributing to ServiceHub! We welcome contributions from the community.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- Be respectful and inclusive
- Be collaborative
- Be patient and understanding
- Focus on what is best for the community

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected behavior**
- **Actual behavior**
- **Screenshots** if applicable
- **Environment details** (OS, browser, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** - why is this enhancement useful?
- **Proposed solution**
- **Alternative solutions** you've considered

### Pull Requests

1. **Fork the repository**
2. **Create a branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Commit your changes** (`git commit -m 'Add amazing feature'`)
5. **Push to the branch** (`git push origin feature/amazing-feature`)
6. **Open a Pull Request**

## Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Commit Messages

Follow the Conventional Commits specification:

- `feat: add new feature`
- `fix: bug fix`
- `docs: documentation changes`
- `style: formatting, missing semi colons, etc.`
- `refactor: code restructuring`
- `test: adding tests`
- `chore: maintenance tasks`

### Testing

- Write tests for new features
- Ensure existing tests pass
- Test manually in the browser
- Test on different devices/browsers

### Documentation

- Update README if needed
- Add JSDoc comments for functions
- Update API documentation for new endpoints
- Include examples in documentation

## Project Structure

```
backend/
├── src/
│   ├── config/       # Configuration files
│   ├── controllers/  # Route handlers
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── middleware/   # Custom middleware
│   ├── services/     # Business logic
│   └── utils/        # Helper functions

frontend/
├── src/
│   ├── app/          # Next.js pages
│   ├── components/   # React components
│   ├── lib/          # Utilities
│   └── types/        # TypeScript types
```

## Setting Up Development Environment

1. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/Orangecompany.git
   cd Orangecompany
   ```

2. **Install dependencies**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Setup environment variables**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env.local
   ```

4. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

## Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Ensure all tests pass**
4. **Update CHANGELOG** if applicable
5. **Request review** from maintainers

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No console errors
- [ ] Tested on multiple browsers
- [ ] Mobile responsive (if UI changes)
- [ ] Commit messages follow convention

## Areas for Contribution

We especially welcome contributions in:

### High Priority
- Payment gateway integration (Stripe/Razorpay)
- Real-time notifications (Socket.io)
- Email notifications
- SMS notifications
- Advanced search and filters
- Reviews and ratings system

### Medium Priority
- Service provider dashboard
- Admin analytics dashboard
- Referral program
- Loyalty points system
- Multi-language support
- Dark mode

### Low Priority
- Unit tests
- E2E tests
- Performance optimizations
- Accessibility improvements
- SEO enhancements

## Questions?

Feel free to:
- Open an issue for questions
- Start a discussion
- Reach out to maintainers

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project website (when available)

## License

By contributing, you agree that your contributions will be licensed under the ISC License.

---

Thank you for contributing to ServiceHub! 🎉
