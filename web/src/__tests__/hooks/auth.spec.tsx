import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';
import { AuthProvider, useAuth } from '../../hooks/auth';
import api from '../../services/api';

const email = 'john.doe@email.com';
const password = '123456';
const name = 'John Doe';
const id = 'id-123';
const token = 'token-123';
const avatar_url = 'avatar.jpeg';
const apiResponse = {
  user: {
    id,
    name,
    email,
    avatar_url,
  },
  token,
};
const storageUser = '@GoBarber:user';
const storageToken = '@GoBarber:token';

const apiMock = new MockAdapter(api);

describe('Auth hook', () => {
  it('should be able to signin', async () => {
    apiMock.onPost('sessions').reply(200, apiResponse);

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email,
      password,
    });

    await waitForNextUpdate();

    expect(setItemSpy).toHaveBeenCalledWith(storageToken, token);
    expect(setItemSpy).toHaveBeenCalledWith(
      storageUser,
      JSON.stringify(apiResponse.user),
    );
    expect(result.current.user.email).toEqual(email);
  });

  it('should restore saved data from storeage when auth inits', () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(key => {
      switch (key) {
        case storageToken:
          return token;
        case storageUser:
          return JSON.stringify(apiResponse.user);
        default:
          return null;
      }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user.email).toEqual(email);
  });

  it('should be able to sign out', () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(key => {
      switch (key) {
        case storageToken:
          return token;
        case storageUser:
          return JSON.stringify(apiResponse.user);
        default:
          return null;
      }
    });

    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.signOut();
    });

    expect(removeItemSpy).toHaveBeenCalledTimes(2);
    expect(result.current.user).toBeUndefined();
  });

  it('should be able to update user data', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const { user } = apiResponse;

    act(() => {
      result.current.updateUser(user);
    });

    expect(setItemSpy).toHaveBeenCalledWith(storageUser, JSON.stringify(user));
    expect(result.current.user).toEqual(user);
  });
});
