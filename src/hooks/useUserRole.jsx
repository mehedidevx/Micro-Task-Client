import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxios from './useAxios';


const useUserRole = () => {
    const { user, loading: authLoading } = useAuth();
    const axios = useAxios();

    const {
        data: role,
        isLoading: roleLoading,
        refetch,
    } = useQuery({
        queryKey: ['userRole', user?.email],
        enabled: !authLoading && !!user?.email,
        queryFn: async () => {
            const res = await axios.get(`/users/${user.email}/role`);
             console.log('Role API response:', res.data);
            return res.data.role;
        },
    });

    return { role, roleLoading: authLoading || roleLoading, refetch };
};

export default useUserRole;
