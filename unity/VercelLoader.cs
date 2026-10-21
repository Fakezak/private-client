using UnityEngine;
using UnityEngine.Networking;
using System.Collections;
using System;
using System.Reflection;

public class VercelModDownloader : MonoBehaviour
{
    string serverUrl = "https://private-client-ten.vercel.app/id";

    void Start()
    {
        StartCoroutine(FetchAndLoadMod());
    }

    IEnumerator FetchAndLoadMod()
    {
        // 1. Verify Login (Get OK)
        using (UnityWebRequest loginReq = UnityWebRequest.Get(serverUrl))
        {
            yield return loginReq.SendWebRequest();
            if (loginReq.downloadHandler.text != "OK") yield break;
        }

        // 2. Ask server for the DLL
        string dllUrl = serverUrl + "?action=get_mod";
        using (UnityWebRequest dllReq = UnityWebRequest.Get(dllUrl))
        {
            yield return dllReq.SendWebRequest();

            if (dllReq.result == UnityWebRequest.Result.Success)
            {
                // Get the raw bytes of the DLL
                byte[] dllBytes = dllReq.downloadHandler.data;

                // 3. Load the DLL into memory (This is the magic part!)
                try
                {
                    Assembly modAssembly = Assembly.Load(dllBytes);
                    
                    // Find the class we want to run (e.g., "VercelLoader")
                    Type modType = modAssembly.GetType("VercelLoader");
                    
                    // Run the mod!
                    if (modType != null)
                    {
                        GameObject modObj = new GameObject("VercelMod");
                        modObj.AddComponent(modType);
                        Debug.Log("Mod DLL Successfully Injected from Vercel!");
                    }
                }
                catch (Exception e)
                {
                    Debug.LogError("Failed to load DLL: " + e.Message);
                }
            }
        }
    }
}
