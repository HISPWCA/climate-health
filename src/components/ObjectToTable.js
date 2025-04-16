export const ObjectToTable = ({ data }) => {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
        return <p>Invalid data. Please provide an object.</p>;
    }

    return (
        <table border='1px' style={{ border: '1px', width: '100%', }}>
            <thead>
                <tr>
                    <th style={{ border: '1px', backgroundColor: 'lightblue', border: '1px', textAlign: 'center', }}>Peaks Count</th>
                    <th style={{ border: '1px', backgroundColor: 'lightblue', border: '1px', textAlign: 'center', }}>Aggregation</th>
                </tr>
            </thead>

            <tbody>
                {Object.entries(data).map(([key, value]) => (
                    <tr key={key}>
                        <td border='1px' style={{ border: '1px', textAlign: 'center', backgroundColor: 'lightgreen', }}>{key}</td>
                        <td border='1px' style={{ border: '1px', textAlign: 'center', backgroundColor: 'lightgreen', }}>{value}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
