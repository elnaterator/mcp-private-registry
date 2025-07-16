package auth

import "context"

// NoneProvider implements Provider but does nothing (no authentication)
type NoneProvider struct{}

func NewNoneProvider() *NoneProvider {
	return &NoneProvider{}
}

func (n *NoneProvider) GetToken(ctx context.Context) (string, error) {
	return "", nil
}

func (n *NoneProvider) NeedsLogin() bool {
	return false
}

func (n *NoneProvider) Login(ctx context.Context) error {
	return nil
}

func (n *NoneProvider) Name() string {
	return "none"
}
